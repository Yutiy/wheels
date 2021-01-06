const url = require('url');

module.exports = {
  get path() {
    return url.parse(this.req.url).pathname;
  },

  get query() {
    return url.parse(this.req.url, true).query;
  },
}
