var util = require('util');

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
        if (docs.length < 1)
          return res.status(404).send();
        for (var i = 0; i < docs.length; i++)
          delete docs[i].body;
        res.send({list: docs});
      });
    }
  }
]