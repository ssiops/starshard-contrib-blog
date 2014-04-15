var fs = require('fs');
var path = require('path');
var hbs = require('handlebars').create();
var walk = require('walk').walk;
var markdown = require('markdown').markdown;

var directory = __dirname + '/../views/';
var partials = directory + 'partials';

var register = function(filepath, done) {
  var isValidTemplate = /\.(html|hbs)$/.test(filepath);
  if (!isValidTemplate) {
    return done(null);
  }

  fs.readFile(filepath, 'utf8', function(err, data) {
    if (err) throw err;
    var ext = path.extname(filepath);
    var templateName = path.relative(partials, filepath)
      .slice(0, -(ext.length)).replace(/[ -]/g, '_');
    hbs.registerPartial(templateName, data);
    done(null);
  });
};

walk(partials).on('file', function(root, stat, next) {
  register(path.join(root, stat.name), next);
}).on('end', function() {});

hbs.registerHelper('parse', function (data, opt) {
  return opt.fn(JSON.parse(data));
});

hbs.registerHelper('md', function (opt) {
  return markdown.toHTML(opt.fn(this));
});

function View() {
  this.layout = fs.readFileSync(directory + 'layout.hbs', {encoding: 'utf8'});
  return this;
}

View.prototype.render = function (name, data, callback) {
  var self = this;
  fs.readFile(directory + name, {encoding: 'utf8'}, function (err, view) {
    if (err) throw err;
    var src = self.layout.replace(/\{\{\{__body__\}\}\}/, view);
    return callback(hbs.compile(src)(data));
  });
};

View.prototype.renderWithLayout = function (name, layout, data, callback) {
  fs.readFile(directory + layout, {encoding: 'utf8'}, function (err, $layout) {
    if (err) throw err;
    fs.readFile(directory + name, {encoding: 'utf8'}, function (err, view) {
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