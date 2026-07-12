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
        ecoregion: ecoregion_guess(lat, lon),
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

    # --- Elevation & slope: USGS EPQS ---
    def fetch_elevation_slope(lat, lon)
      d = 0.0003
      points = [[lat, lon], [lat + d, lon], [lat - d, lon], [lat, lon + d], [lat, lon - d]]
      vals = points.map { |la, lo| safe { epqs(la, lo) } }
      center, n, s, e, w = vals
      slope = nil
      if [n, s, e, w].all?
        span_m = 2 * d * 111_320
        dz = Math.hypot(n - s, e - w)
        slope = (Math.atan2(dz, span_m) * 180 / Math::PI).round(1)
      end
      { elevationFt: center&.round, slopeDeg: slope }
    end

    def epqs(lat, lon)
      url = "https://epqs.nationalmap.gov/v1/json?x=#{lon}&y=#{lat}&units=Feet&wkid=4326&includeDate=false"
      data = get_json(url)
      v = data["value"] || data["elevation"]
      Float(v)
    rescue ArgumentError, TypeError
      nil
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

    def ecoregion_guess(lat, lon)
      if lat.between?(24, 49) && lon.between?(-100, -66)
        "Eastern Temperate Forest (broad)"
      end
    end
  end
end
