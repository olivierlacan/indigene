module Indigene
  # Base action. Adds permissive CORS headers so the statically-hosted PWA (on a
  # different origin) can call this API. Tighten the allowed origin before any
  # real deployment.
  class Action < Hanami::Action
    private

    def add_cors(response)
      response.headers["Access-Control-Allow-Origin"] = "*"
      response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
      response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    end
  end
end
