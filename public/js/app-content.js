function contentCtrl($scope, $window, $http, $alertService) {
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
    $http.get('/blog/archive', {params: {l:3}}).success(function (data, status) {
      angular.element($window.document.getElementById('other-posts-loading')).remove();
      if (data.list)
        $scope.otherposts = data.list;
      if (data.msg)
        $alertService.send(data.msg);
    });
  }
  $scope.getComments = function () {
    $http.get('/blog/archive/' + $scope.displaytitle + '/comments').success(function (data, status) {
      angular.element($window.document.getElementById('comments-loading')).remove();
      if (data.comments)
        $scope.comments = data.comments;
      if (data.msg)
        $alertService.send(data.msg);
    });
  }
  $scope.postComment = function () {
    $scope.err = {};
    if ($scope.newComment.length < 1)
      return $scope.err.comment = true;
    $http.put('/blog/archive/' + $scope.displaytitle + '/comments', {content: $scope.newComment}).success(function (data, status) {
      if (data.comment)
        $scope.comments.push(data.comment);
      if (data.msg)
        $alertService.send(data.msg);
    });
  }
  $scope.removeComment = function ($index) {
    $http.delete('/blog/archive/' + $scope.displaytitle + '/comments/' + $scope.comments[$index]._id).success(function (data, status) {
      if (status == 202)
        $scope.comments.splice($index, 1);
      $alertService.send({msg: 'The comment was successfully removed.', style: 'success'});
      if (data.msg)
        $alertService.send(data.msg);
    });
  }
}