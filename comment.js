var view = require('./lib/view.js');

module.exports = [
  {
    path: '/archive/:title/comments',
    method: 'GET',
    respond: function (req, res, db) {
      db.find({blog: req.params.title}, 'comments', {sort: {_id: 1}}, function (err, docs) {
        if (err) return console.log(util.inspect(err));
        if (docs.length < 1) return res.send({msg: 'Nobody has posted thier comments yet.'});
        res.send({comments: docs});
      });
    }
  },
  {
    path: '/archive/:title/comments',
    method: 'PUT',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined') {
        return res.status(403).send({err: 'Forbidden.'});
      }
      var comment = {blog: req.params.title, content: req.body.content, date: new Date(), author: req.session.user.name};
      db.insert(comment, 'comments', {}, function (err, docs) {
        if (err) return console.log(util.inspect(err));
        res.send({comment: docs[0]});
      });
    }
  },
  {
    path: '/archive/:title/comments',
    method: 'DELETE',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined') {
        return res.status(403).send({err: 'Forbidden.'});
      }
      db.find({blog: req.params.title, _id: new db.util.ObjectID(req.body._id)}, 'comments', {limit: 1}, function (err, docs) {
        if (err) return console.log(util.inspect(err));
        if (docs.length < 1) return res.send({msg: 'The specified comment cannot be found.'});
        if (!req.session.user.admin) {
          if (req.session.user.name != docs[0].author)
            return res.status(403).send({err: 'Forbidden.'});
        }
        res.status(204).send();
        db.remove({blog: req.params.title, _id: new db.util.ObjectID(req.body._id)}, 'comments', {}, function (err) {
          if (err) return console.log(util.inspect(err)); 
        });
      });
    }
  }
]