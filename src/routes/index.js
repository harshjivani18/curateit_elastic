const baseRoute = "/api";

module.exports = (app) => {
  // app.use(`${baseRoute}/elastic-search`, require("./elastic-search.route"));
  app.use(`${baseRoute}/open-search`, require("./opensearch.route"));
};