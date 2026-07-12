module Indigene
  module Actions
    module Site
      # GET /api/site?lat=..&lon.. — aggregates soil, elevation and climate from
      # the upstream public sources, server-side, and returns the same shape the
      # PWA's client-side fetcher produces. Doing it here avoids browser CORS
      # limits and keeps any future API keys off the client.
      class Show < Indigene::Action
        def handle(request, response)
          add_cors(response)
          response.format = :json

          lat = coerce_float(request.params[:lat])
          lon = coerce_float(request.params[:lon])
          if lat.nil? || lon.nil? || lat.abs > 90 || lon.abs > 180
            response.status = 422
            response.body = JSON.generate(error: "lat and lon are required numeric query params")
            return
          end

          response.body = JSON.generate(SiteFetcher.new.call(lat:, lon:))
        end

        private

        def coerce_float(value)
          Float(value)
        rescue ArgumentError, TypeError
          nil
        end
      end
    end
  end
end
