function Blog (opt) {
  for (var prop in opt)
    this[prop] = opt[prop];
  if (typeof this.displaytitle === 'undefined')
    this.displaytitle = this.title.replace(/[ ]+/g, '-');
  if (typeof this.date === 'undefined')
    this.date = new Date();
  return this;
}

module.exports = Blog;