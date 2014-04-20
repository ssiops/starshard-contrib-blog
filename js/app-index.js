function carouselCtrl ($scope, $http) {
  $scope.interval = 10000;
  $scope.slides = [
    {image: 'loading-haven.jpg', text: 'Haven'}
  ];
  var sync = function () {
    $http.get('/usercontent/blog/carousel.json').success(function (data) {
      $scope.slides = $scope.slides.concat(data.list);
    });
  }
  sync();
}

function blogThumbCtrl ($scope, $http, $window, $alertService) {
  $scope.getBlogs = function (limit, tags) {
    var opt = {params: {}};
    if (typeof limit !== 'undefined')
      opt.params.l = limit;
    if (typeof tags !== 'undefined')
      opt.params.t = tags;
    $http.get('/blog/archive', opt).success(function (data, status) {
      angular.element($window.document.getElementById($scope.loading)).remove();
      if (data.list)
        $scope.blogs = data.list;
      if (data.err && data.msg)
        return $alertService.send(data.msg);
      if (data.msg)
        $scope.msg = data.msg;
    });
  }
}