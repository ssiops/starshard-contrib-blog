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
        if (err) throw err;
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
    path: '/archive/:title',
    method: 'DELETE',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        return res.status(403).send({err: 'Forbidden.', msg: {msg: 'You do not have permission to perform this action.', style:'danger'}});
      }
      db.remove({displaytitle: req.params.title}, 'blogs', {}, function (err) {
        if (err) {
          console.log(util.inspect(err));
          return res.send({err: err, msg: {msg: 'An error has occurred. Please try again later.', style:'danger'}});
        }
        return res.status(204).send();
      });
    }
  },
  {
    path: '/archive',
    method: 'PUT',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        return res.status(403).send({err: 'Forbidden.', msg: {msg: 'You do not have permission to perform this action.', style:'danger'}});
      }
      var blog = new Blog(req.body);
      db.update({displaytitle: blog.displaytitle}, blog, 'blogs', {upsert: true}, function (err) {
        if (err) {
          console.log(util.inspect(err));
          return res.send({err: err, msg: {msg: 'An error has occurred. Please try again later.', style:'danger'}});
        }
        return res.send({redirect: blog.displaytitle});
      });
    }
  }
]