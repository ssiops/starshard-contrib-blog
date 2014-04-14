function Blog (opt) {
  for (var prop in opt)
    this[prop] = opt[prop];
  if (typeof this.displaytitle === 'undefined')
    this.displaytitle = this.title.replace(/[ ]+/g, '-');
  return this;
}

module.exports = Blog;