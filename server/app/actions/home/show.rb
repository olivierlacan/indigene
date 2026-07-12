module Indigene
  module Actions
    module Home
      class Show < Indigene::Action
        def handle(_request, response)
          response.format = :json
          response.body = JSON.generate(
            name: "Indigene API",
            version: "0.1.0",
            endpoints: {
              site: "/api/site?lat=<lat>&lon=<lon>",
              health: "/up"
            },
            note: "The plant catalog is bundled in the offline PWA and is not served here."
          )
        end
      end
    end
  end
end
