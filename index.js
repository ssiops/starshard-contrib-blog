var shard = require('./shard.json');
var view = require('./lib/view.js');

shard.routes = [
  {
    path: '/',
    method: 'GET',
    respond: function (req, res, db) {
      view.send(res, 'index.hbs');
    }
  }
]

module.exports = shard;