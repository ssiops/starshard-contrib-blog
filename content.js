var util = require('util');
var async = require('async');
var view = require('./lib/view.js');

module.exports = [
  {
    path: '/archive/tags',
    method: 'GET',
    respond: function (req, res, db) {
      db.aggregate([{$unwind:"$tags"}, {$group:{_id:"$tags"}}], 'blogs', {}, function (err, results) {
        if (err) {
          console.log(util.inspect(err));
          return res.send({msg: {msg: 'An error has occurred. Please try again later.', style:'danger'}});
        }
        if (results.length < 1) return res.send({result: 'No tags were found.'});
        async.map(results, function (result, callback) {
          return callback(null, result._id);
        }, function (err, results) {
          if (typeof req.query.t !== 'undefined') {
            pattern = new RegExp('^' + req.query.t);
            async.filter(results, function (tag, callback) {
              return callback(pattern.test(tag));
            }, function (filtered) {
              return res.send({list: filtered});
            });
          } else 
            return res.send({list: results});
        })
      });
    }
  },
  {
    path: '/archive/:title',
    method: 'GET',
    respond: function (req, res, db) {
      db.find({displaytitle: req.params.title}, 'blogs', {limit: 1}, function (err, docs) {
        if (err) throw err;
        if (docs.length < 1)
          return res.status(404).render('404.hbs', {path: req.originalUrl});
        if (req.query.json)
          return res.send({blog: docs[0]});
        view.send(res, 'content.hbs', {
          nav: {archive: true},
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
      var option = {sort: {_id: -1}};
      if (typeof req.query.t !== 'undefined' && req.query.t.length > 0) {
        var tags = req.query.t.split('_');
        if (tags.length > 1)
          filter.tags = {$all: tags};
        else
          filter.tags = req.query.t;
      }
      if (typeof req.query.l !== 'undefined')
        option.limit = parseInt(req.query.l);
      db.find(filter, 'blogs', option, function (err, docs) {
        if (err) throw err;
        if (docs.length < 1) {
          if (req.accepts('application/json', 'text/html') == 'application/json')
            return res.send({result: 'No blogs were found.'});
          else
            return view.send(res, 'list.hbs', {
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