module.exports = [
  {
    path: '/carousel',
    method: 'GET',
    respond: function (req, res, db) {
      res.send({list: [
        {image: 'loading-agria.jpg', text: 'Agria'},
        {image: 'loading-shakuras.jpg', text: 'Shakuras'},
        {image: 'loading-typhon.jpg', text: 'Typhon'},
        {image: 'loading-ulaan.jpg', text: 'Ulaan'}
      ]});
    }
  }
]