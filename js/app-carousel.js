angular.module('blog', ['angularFileUpload', 'ui.bootstrap']).
  factory('$alertService', ['$rootScope', function ($rootScope) {
    return alertService($rootScope);
  }]);

function carouselSetting ($scope, $http, $fileUploader, $alertService) {
  $scope.slides = [];

  $scope.getSlides = function () {
    $http.get('/usercontent/blog/carousel.json').success(function (data) {
      $scope.slides = $scope.slides.concat(data.list);
    });
  }

  $scope.forward = function (index) {
    var buf = $scope.slides.splice(index, 1);
    $scope.slides.splice(index - 1, 0, buf[0]);
  }
  $scope.backward = function (index) {
    var buf = $scope.slides.splice(index, 1);
    $scope.slides.splice(index + 1, 0, buf[0]);
  }
  $scope.remove = function (index) {
    $scope.slides.splice(index, 1);
  }

  $scope.uploader = $fileUploader.create({
    scope: $scope,
    url: '/usercontent/blog/img',
    autoUpload: true
  });

  $scope.uploader.progress = 0;

  $scope.uploader.bind('success', function (event, xhr, item, response) {
    $scope.slides.push({
      image: response.filename
    });
  });

  $scope.save = function () {
    $http.put('/blog/carousel', {list: $scope.slides}).success(function (data, status) {
      if (status == 201)
        $alertService.send({msg: 'Your configuration has been successfully saved.', style: 'success'});
    });
  }

  $scope.getSlides();
}