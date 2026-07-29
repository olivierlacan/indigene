require "net/http"
require "json"
require "uri"

module Indigene
  # Server-side port of the PWA's site fetcher (see app/src/lib/site.ts).
  # Every upstream call is best-effort: a failure degrades to nil rather than
  # failing the whole response. Soil is always labelled "coarse" — never
  # presented as measured fact.
  class SiteFetcher
    TIMEOUT = 12 # seconds

    def call(lat:, lon:)
      soil    = safe { fetch_soil(lat, lon) }
      elev    = safe { fetch_elevation_slope(lat, lon) }
      climate = safe { fetch_climate(lat, lon) }
      eco     = safe { fetch_ecoregion(lat, lon) }

      {
        lat:, lon:,
        elevationFt: elev&.dig(:elevationFt),
        slopeDeg: elev&.dig(:slopeDeg),
        zone: climate&.dig(:zone),
        zoneMinTempF: climate&.dig(:minTempF),
        annualRainIn: climate&.dig(:annualRainIn),
        soil: soil || {
          texture: nil, drainage: nil, phEstimate: nil,
          source: "unavailable", confidence: "unknown"
        },
        ecoregion: ecoregion_label(eco, lat, lon),
        ecoregionInfo: eco,
        fromCache: false
      }
    end

    private

    def safe
      yield
    rescue StandardError
      nil
    end

    def get_json(url)
      uri = URI(url)
      res = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https",
                            open_timeout: TIMEOUT, read_timeout: TIMEOUT) do |http|
        http.get(uri.request_uri, "User-Agent" => "indigene/0.1")
      end
      raise "http #{res.code}" unless res.is_a?(Net::HTTPSuccess)

      JSON.parse(res.body)
    end

    # --- Soil: ISRIC SoilGrids ---
    def fetch_soil(lat, lon)
      url = "https://rest.isric.org/soilgrids/v2.0/properties/query?lat=#{lat}&lon=#{lon}" \
            "&property=sand&property=silt&property=clay&property=phh2o&depth=0-5cm&value=mean"
      data = get_json(url)
      layers = data.dig("properties", "layers") || []
      mean = lambda do |name|
        layer = layers.find { |l| l["name"] == name }
        v = layer&.dig("depths", 0, "values", "mean")
        factor = layer&.dig("unit_measure", "d_factor") || 1
        v.nil? ? nil : v.to_f / factor
      end
      sand = mean.call("sand"); silt = mean.call("silt"); clay = mean.call("clay")
      ph = mean.call("phh2o")
      texture = (sand && silt && clay) ? texture_class(sand, silt, clay) : nil
      {
        texture:,
        drainage: texture ? drainage_for(texture) : nil,
        phEstimate: ph&.round(1),
        source: "ISRIC SoilGrids (250 m grid)",
        confidence: "coarse"
      }
    end

    def texture_class(sand, silt, clay)
      total = (sand + silt + clay).nonzero? || 1
      s = sand / total * 100; si = silt / total * 100; c = clay / total * 100
      return "clay" if c >= 40 && si < 40 && s <= 45
      return "sandy clay" if c >= 35 && s >= 45
      return "silty clay" if c >= 40 && si >= 40
      return "silty clay loam" if c >= 27 && s <= 20
      return "clay loam" if c >= 27 && s > 20 && s <= 45
      return "sandy clay loam" if c >= 20 && c < 35 && s > 45 && si < 28
      return "silt" if si >= 80 && c < 12
      return "silt loam" if si >= 50 && c < 27
      return "sand" if s >= 85
      return "loamy sand" if s >= 70
      return "sandy loam" if c < 20 && s >= 43 && si < 50

      "loam"
    end

    def drainage_for(texture)
      return "drains fast (well drained)" if texture.include?("sand")
      return "drains slowly (can stay wet)" if texture.include?("clay")

      "moderate drainage"
    end

    # --- Elevation & slope: USGS EPQS in the US, Open-Meteo elevation elsewhere ---
    # Both return feet here (Open-Meteo is converted from metres), so the slope
    # math is identical whichever source answered.
    M_TO_FT = 3.28084

    def fetch_elevation_slope(lat, lon)
      d = 0.0003
      points = [[lat, lon], [lat + d, lon], [lat - d, lon], [lat, lon + d], [lat, lon - d]]
      vals = in_conus?(lat, lon) ? epqs_cross(points) : open_meteo_elev_cross(points)
      center, n, s, e, w = vals
      slope = nil
      if [n, s, e, w].all?
        span_m = 2 * d * 111_320
        dz = Math.hypot(n - s, e - w)
        slope = (Math.atan2(dz, span_m) * 180 / Math::PI).round(1)
      end
      { elevationFt: center&.round, slopeDeg: slope }
    end

    # USGS EPQS, one query per point (US only). Feet.
    def epqs_cross(points)
      points.map { |la, lo| safe { epqs(la, lo) } }
    end

    def epqs(lat, lon)
      url = "https://epqs.nationalmap.gov/v1/json?x=#{lon}&y=#{lat}&units=Feet&wkid=4326&includeDate=false"
      data = get_json(url)
      v = data["value"] || data["elevation"]
      Float(v)
    rescue ArgumentError, TypeError
      nil
    end

    # Open-Meteo elevation (global, keyless): all five points in one call, m → ft.
    def open_meteo_elev_cross(points)
      lats = points.map { |p| p[0] }.join(",")
      lons = points.map { |p| p[1] }.join(",")
      data = get_json("https://api.open-meteo.com/v1/elevation?latitude=#{lats}&longitude=#{lons}")
      arr = data["elevation"] || []
      points.each_index.map { |i| arr[i].is_a?(Numeric) ? arr[i] * M_TO_FT : nil }
    rescue StandardError
      points.map { nil }
    end

    def in_conus?(lat, lon)
      lat.between?(24, 50) && lon.between?(-125, -66)
    end

    def in_europe?(lat, lon)
      lat.between?(34, 72) && lon.between?(-25, 45)
    end

    # --- Climate: Open-Meteo archive → zone + rainfall ---
    def fetch_climate(lat, lon)
      url = "https://archive-api.open-meteo.com/v1/archive?latitude=#{lat}&longitude=#{lon}" \
            "&start_date=2021-01-01&end_date=2024-12-31" \
            "&daily=temperature_2m_min,precipitation_sum" \
            "&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto"
      data = get_json(url)
      days = data.dig("daily", "time") || []
      tmin = data.dig("daily", "temperature_2m_min") || []
      precip = data.dig("daily", "precipitation_sum") || []
      return nil if days.empty?

      year_min = Hash.new(Float::INFINITY)
      year_rain = Hash.new(0.0)
      days.each_with_index do |day, i|
        y = day[0, 4]
        year_min[y] = [year_min[y], tmin[i]].min if tmin[i]
        year_rain[y] += precip[i] if precip[i]
      end
      mins = year_min.values.select { |v| v.finite? }
      return nil if mins.empty?

      avg_min = mins.sum / mins.size
      rains = year_rain.values
      annual_rain = rains.empty? ? 0 : (rains.sum / rains.size).round
      { zone: zone_from_min_temp(avg_min), minTempF: avg_min.round, annualRainIn: annual_rain }
    end

    def zone_from_min_temp(t_f)
      n = ((t_f + 60) / 10).floor + 1
      within = t_f + 60 - (n - 1) * 10
      half = within < 5 ? "a" : "b"
      "#{n.clamp(1, 13)}#{half}"
    end

    # --- Ecoregion: EPA (US) or EEA (Europe) via ArcGIS, picked by coordinates ---
    # Server-side, so no CORS concern. Best-effort; nil on failure, which the
    # caller turns into the coarse box guess. Provider-tagged so the client sees
    # one shape whichever service answered (mirrors app/src/lib/site.ts).
    EPA_ECOREGION_QUERY_URL =
      "https://gispub.epa.gov/arcgis/rest/services/ORD/USEPA_Ecoregions_Level_III_and_IV/MapServer/7/query".freeze
    EEA_ECOREGION_QUERY_URL =
      "https://bio.discomap.eea.europa.eu/arcgis/rest/services/BioRegions/BiogeographicalRegions_WM/MapServer/0/query".freeze

    # The eleven EEA biogeographical regions: [slug, display name, match].
    EEA_REGIONS = [
      ["alpine", "Alpine", /alpine/],
      ["atlantic", "Atlantic", /atlantic/],
      ["black-sea", "Black Sea", /black\s*sea/],
      ["boreal", "Boreal", /boreal/],
      ["continental", "Continental", /continental/],
      ["mediterranean", "Mediterranean", /mediterran/],
      ["pannonian", "Pannonian", /pannonian/],
      ["steppic", "Steppic", /steppic/],
      ["arctic", "Arctic", /arctic/],
      ["anatolian", "Anatolian", /anatolian/],
      ["macaronesia", "Macaronesia", /macaronesia/]
    ].freeze

    def fetch_ecoregion(lat, lon)
      return fetch_ecoregion_eea(lat, lon) if in_europe?(lat, lon)
      return fetch_ecoregion_epa(lat, lon) if in_conus?(lat, lon)

      nil
    end

    def fetch_ecoregion_epa(lat, lon)
      url = "#{EPA_ECOREGION_QUERY_URL}?geometry=#{lon},#{lat}&geometryType=esriGeometryPoint" \
            "&inSR=4326&spatialRel=esriSpatialRelIntersects" \
            "&outFields=US_L4CODE,US_L4NAME,US_L3CODE,US_L3NAME,NA_L2NAME,NA_L1NAME" \
            "&returnGeometry=false&f=json"
      data = get_json(url)
      attrs = data.dig("features", 0, "attributes")
      return nil unless attrs

      name = presence(attrs["US_L3NAME"])
      code = presence(attrs["US_L3CODE"])
      return nil unless name && code

      l4_code = presence(attrs["US_L4CODE"])
      l4_name = presence(attrs["US_L4NAME"])
      {
        provider: "epa-omernik",
        code: code,
        name: name,
        hierarchy: [to_title(presence(attrs["NA_L1NAME"])), to_title(presence(attrs["NA_L2NAME"]))].compact,
        detail: (l4_code && l4_name) ? { code: l4_code, name: l4_name } : nil
      }
    end

    # EEA response. Layer 0 + field names confirmed against the live service (see
    # data/sources/eea-biogeographical-regions/probe.json): the region slug is in
    # `short_name`. Read that first, then fall back to scanning all returned
    # fields so a future rename can't silently break the lookup.
    def fetch_ecoregion_eea(lat, lon)
      url = "#{EEA_ECOREGION_QUERY_URL}?geometry=#{lon},#{lat}&geometryType=esriGeometryPoint" \
            "&inSR=4326&spatialRel=esriSpatialRelIntersects" \
            "&outFields=short_name,code,name&returnGeometry=false&f=json"
      data = get_json(url)
      attrs = data.dig("features", 0, "attributes")
      return nil unless attrs

      hit = match_eea_region(attrs["short_name"]) || attrs.each_value.lazy.map { |v| match_eea_region(v) }.find(&:itself)
      return nil unless hit

      { provider: "eea-biogeo", code: hit[0], name: hit[1], hierarchy: [], detail: nil }
    end

    # Canonicalize one value (a short_name slug or any label) to [slug, name].
    def match_eea_region(v)
      s = presence(v.to_s)
      return nil unless s

      low = s.downcase
      hit = EEA_REGIONS.find { |(_slug, _name, re)| low.match?(re) }
      hit && [hit[0], hit[1]]
    end

    def ecoregion_label(eco, lat, lon)
      if eco
        suffix = eco[:provider] == "eea-biogeo" ? "EEA biogeographical region" : "EPA Level III ecoregion"
        return "#{eco[:name]} (#{suffix})"
      end

      ecoregion_guess(lat, lon)
    end

    # Coarse fallback used only when the live lookup fails.
    def ecoregion_guess(lat, lon)
      return "Marine West Coast Forest (broad)" if lat.between?(42, 49) && lon.between?(-124.9, -120.5)
      return "Southern Coastal Plain (broad)" if lat.between?(24.4, 31) && lon.between?(-87.7, -79.8)
      return "Eastern Temperate Forest (broad)" if lat.between?(24, 49) && lon.between?(-100, -66)
      if in_europe?(lat, lon)
        return "Mediterranean (broad)" if lat <= 44.2 && lon.between?(2.5, 10.0)
        return "Atlantic (broad)" if lat.between?(42.5, 51.6) && lon.between?(-5.5, 8.5)
      end

      nil
    end

    def presence(val)
      s = val.to_s.strip
      s.empty? ? nil : s
    end

    def to_title(str)
      return nil unless str

      str.downcase.gsub(/\b\w/, &:upcase)
    end
  end
end
