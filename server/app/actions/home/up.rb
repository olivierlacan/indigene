module Indigene
  module Actions
    module Home
      class Up < Indigene::Action
        def handle(_request, response)
          response.format = :json
          response.body = JSON.generate(status: "ok")
        end
      end
    end
  end
end
