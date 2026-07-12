module Indigene
  class Routes < Hanami::Routes
    root to: "home.show"

    # Health check.
    get "/up", to: "home.up"

    # Aggregated site lookup: GET /api/site?lat=..&lon=..
    get "/api/site", to: "site.show"
    # Browsers preflight the cross-origin GET; answer it.
    options "/api/site", to: "site.options"
  end
end
