function tagSearchCtrl ($scope, $http) {
  $scope.getTags = function (name) {
    return $http.get('/blog/archive/tags', {params: {t: name}}).then(function (res) {
      if (res.data.err)
        console.log(res.data.err);
      if (res.data.msg)
        console.log(res.data.msg);
      return res.data.list;
    });
  }
}