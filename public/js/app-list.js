function blogListCtrl ($scope, $window, $http, $alertService) {
  $scope.remove = function (index) {
    $http.delete('/blog/archive/' + $scope.blogs[index].displaytitle).success(function (data, status) {
      if (status == 204)
        $scope.blogs.splice(index, 1);
    });
  }

  $scope.getPosts = function () {
    $http.get('/blog/archive').success(function (data, status) {
      angular.element($window.document.getElementById('blogs-loading')).remove();
      if (data.list)
        $scope.blogs = data.list;
      if (data.msg)
        $alertService.send(data.msg);
    });
  }

  $scope.getTags = function (name) {
    return $http.get('/blog/archive/tags', {params: {t: name}}).then(function (res) {
      if (res.data.err)
        console.log(res.data.err);
      if (res.data.msg)
        console.log(res.data.msg);
      return res.data.list;
    });
  }

  $scope.getPosts();
}