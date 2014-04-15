function contentCtrl($scope, $window, $http) {
  $scope.remove = function () {
    $http.delete('/blog/archive/' + $scope.displaytitle).success(function (data, status) {
      if (status == 204)
        return $window.location.href = '/blog';
    });
  }
  $scope.getPosts = function () {
    $http.get('/blog/archive').success(function (data, status) {
      angular.element($window.document.getElementById('other-posts-loading')).remove();
      if (data.list)
        $scope.otherposts = data.list;
      if (data.err)
        console.log(err);
    });
  }
  $scope.getComments = function () {
    $http.get('/blog/' + $scope.displaytitle + '/comments').success(function (data, status) {
      angular.element($window.document.getElementById('comments-loading')).remove();
      if (data.list)
        $scope.comments = data.list;
      if (data.err)
        console.log(err);
    });
  }
}