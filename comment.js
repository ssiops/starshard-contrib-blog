var view = require('./lib/view.js');

module.exports = [
  {
    path: '/archive/:title/comments',
    method: 'GET',
    respond: function (req, res, db) {
      db.find({blog: req.params.title}, 'comments', {sort: {_id: 1}}, function (err, docs) {
        if (err) {
          console.log(util.inspect(err));
          return res.send({err: err, msg: {msg: 'An error has occurred. Please try again later.', style:'danger'}});
        }
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
        return res.status(403).send({err: 'Forbidden.', msg: {msg: 'You do not have permission to perform this action.', style:'danger'}});
      }
      var comment = {blog: req.params.title, content: req.body.content, date: new Date(), author: req.session.user.name};
      db.insert(comment, 'comments', {}, function (err, docs) {
        if (err) {
          console.log(util.inspect(err));
          return res.send({err: err, msg: {msg: 'An error has occurred. Please try again later.', style:'danger'}});
        }
        res.send({comment: docs[0], msg: {msg: 'Your comment has been sent.', style: 'success'}});
      });
    }
  },
  {
    path: '/archive/:title/comments/:id',
    method: 'DELETE',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined') {
        return res.status(403).send({err: 'Forbidden.', msg: {msg: 'You do not have permission to perform this action.', style:'danger'}});
      }
      db.find({blog: req.params.title, _id: new db.util.ObjectID(req.params.id)}, 'comments', {limit: 1}, function (err, docs) {
        if (err) {
          console.log(util.inspect(err));
          return res.send({err: err, msg: {msg: 'An error has occurred. Please try again later.', style:'danger'}});
        }
        if (docs.length < 1) return res.send({msg: 'The specified comment cannot be found.'});
        if (!req.session.user.admin) {
          if (req.session.user.name != docs[0].author)
            return res.status(403).send({err: 'Forbidden.', msg: {msg: 'You do not have permission to perform this action.', style:'danger'}});
        }
        res.status(202).send();
        db.remove({blog: req.params.title, _id: new db.util.ObjectID(req.params.id)}, 'comments', {}, function (err) {
          if (err) return console.log(util.inspect(err)); 
        });
      });
    }
  }
]