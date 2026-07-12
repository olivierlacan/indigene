module Indigene
  module Actions
    module Site
      # CORS preflight for /api/site.
      class Options < Indigene::Action
        def handle(_request, response)
          add_cors(response)
          response.status = 204
          response.body = ""
        end
      end
    end
  end
end
