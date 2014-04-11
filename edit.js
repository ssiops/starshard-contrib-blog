var util = require('util');
var view = require('./lib/view.js');

var Blog = require('./lib/blog.js');

module.exports = [
  {
    path: '/new',
    method: 'GET',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      view.send(res, 'editor.hbs', {
        nav: {new: true},
        user: req.session.user
      });
    }
  },
  {
    path: '/archive/:title/edit',
    method: 'GET',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      db.find({displaytitle: req.params.title}, 'blogs', {limit: 1}, function (err, docs) {
        if (err) return console.log(util.inspect(err));
        if (docs.length < 1)
          return res.status(404).render('404.hbs', {path: req.originalUrl});
        view.send(res, 'editor.hbs', {
          nav: {blog: true},
          user: req.session.user,
          blog: docs[0]
        });
      });
    }
  },
  {
    path: '/archive',
    method: 'PUT',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        return res.status(403).send({err: 'Forbidden.'});
      }
      var blog = new Blog(req.body);
      db.update({displaytitle: blog.displaytitle}, blog, 'blogs', {upsert: true}, function (err) {
        if (err) return console.log(util.inspect(err));
        return res.stauts(204).send();
      });
    }
  }
]