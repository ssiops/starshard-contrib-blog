var fs = require('fs');
var util = require('util')

var view = require('./lib/view.js');

module.exports = [
  {
    path: '/carousel',
    method: 'GET',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      view.send(res, 'carousel.hbs', {
        user: req.session.user
      });
    }
  },
  {
    path: '/carousel',
    method: 'PUT',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        return res.status(403).send({err: 'Forbidden.', msg: {msg: 'You do not have permission to perform this action.', style:'danger'}});
      }
      var json = JSON.stringify({list: req.body.list}, null, 4);
      fs.writeFile(process.cwd() + '/usercontent/usercontent/blog/carousel.json', json, function (err) {
        if (err) {
          console.log(util.inspect(err));
          return res.send({err: err, msg: 'An error has occurred. Please try again later.'});
        }
        return res.status(201).send();
      });
    }
  }
]