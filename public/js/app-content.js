function contentCtrl($scope, $window, $http) {
  $scope.newComment = '';
  $scope.err = {};
  $scope.comments = [];

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
    $http.get('/blog/archive/' + $scope.displaytitle + '/comments').success(function (data, status) {
      angular.element($window.document.getElementById('comments-loading')).remove();
      if (data.comments)
        $scope.comments = data.comments;
      if (data.err)
        console.log(err);
      if (data.msg)
        console.log(msg);
    });
  }
  $scope.postComment = function () {
    $scope.err = {};
    if ($scope.newComment.length < 1)
      return $scope.err.comment = true;
    $http.put('/blog/archive/' + $scope.displaytitle + '/comments', {content: $scope.newComment}).success(function (data, status) {
      if (data.comment)
        $scope.comments.push(data.comment);
      if (data.err)
        console.log(err);
      if (data.msg)
        console.log(msg);
    });
  }
}