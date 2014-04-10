var fs = require('fs');
var hbs = require('handlebars');

hbs.registerPartials('../views/partials');

hbs.registerHelper('parse', function (data, opt) {
  return opt.fn(JSON.parse(data));
});

function View() {
  this.layout = fs.readFileSync('../views/layout.hbs', {encoding: 'utf8'});
  return this;
}

View.prototype.render = function (name, data, callback) {
  var self = this;
  fs.readFile('../views/' + name, {encoding: 'utf8'}, function (err, view) {
    if (err) throw err;
    var src = self.layout.replace(/\{\{\{__body__\}\}\}/, view);
    return callback(hbs.compile(src)(data));
  });
};

View.prototype.renderWithLayout = function (name, layout, data, callback) {
  fs.readFile('../views/' + layout, {encoding: 'utf8'}, function (err, $layout) {
    if (err) throw err;
    fs.readFile('../views/' + name, {encoding: 'utf8'}, function (err, view) {
      if (err) throw err;
      var src = $layout.replace(/\{\{\{__body__\}\}\}/, view);
      return callback(hbs.compile(src)(data));
    });
  });
}

View.prototype.send = function (res, name, data) {
  this.render(name, data, function (result) {
    res.set('Content-Type', 'text/html');
    res.send(result);
  });
}

module.exports = new View();