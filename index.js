var shard = require('./shard.json');
var view = require('./lib/view.js');

shard.routes = [
  {
    path: '/',
    method: 'GET',
    respond: function (req, res, db) {
      view.send(res, 'index.hbs', {
        nav: {blog: true},
        user: req.session.user
      });
    }
  }
].concat(
  require('./content.js'),
  require('./edit.js'),
  require('./comment.js'),
  require('./util.js')
);

module.exports = shard;