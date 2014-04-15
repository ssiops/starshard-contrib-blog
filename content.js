var util = require('util');
var view = require('./lib/view.js');

module.exports = [
  {
    path: '/archive/:title',
    method: 'GET',
    respond: function (req, res, db) {
      db.find({displaytitle: req.params.title}, 'blogs', {limit: 1}, function (err, docs) {
        if (err) return console.log(util.inspect(err));
        if (docs.length < 1)
          return res.status(404).render('404.hbs', {path: req.originalUrl});
        if (req.query.json)
          return res.send({blog: docs[0]});
        view.send(res, 'content.hbs', {
          nav: {blog: true},
          user: req.session.user,
          blog: docs[0]
        });
      });
    }
  },
  {
    path: '/archive',
    method: 'GET',
    respond: function (req, res, db) {
      var filter = {};
      var option = {limit: 3, sort: {_id: 0}};
      if (typeof req.query.t !== 'undefined')
        filter.tags = req.query.t.split('_');
      if (typeof req.query.l !== 'undefined' && parseInt(req.query.l) < 10)
        option.limit = parseInt(req.query.l);
      db.find(filter, 'blogs', option, function (err, docs) {
        if (err) return console.log(util.inspect(err));
        if (docs.length < 1) {
          if (req.accepts('application/json', 'text/html') == 'application/json')
            res.send({msg: 'No blogs were found.'});
          else
            view.send(res, 'list.hbs', {
              nav: {archive: true},
              user: req.session.user
            });
        }
        for (var i = 0; i < docs.length; i++)
          delete docs[i].body;
        if (req.accepts('application/json', 'text/html') == 'application/json')
          res.send({list: docs});
        else
          view.send(res, 'list.hbs', {
            nav: {archive: true},
            user: req.session.user,
            blogs: docs
          });
      });
    }
  }
]