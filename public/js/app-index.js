function carouselCtrl ($scope, $http) {
  $scope.interval = 10000;
  $scope.slides = [
    {image: 'loading-haven.jpg', text: 'Haven'}
  ];
  var sync = function () {
    $http.get('/blog/carousel').success(function (data) {
      $scope.slides = $scope.slides.concat(data.list);
    });
  }
  sync();
}