function tagsCtrl ($scope) {
  $scope.tags = [];
  $scope.input = '';
  $scope.addTag = function () {
    if ($scope.input.length < 1) return;
    if ($scope.tags.indexOf($scope.input) >= 0) return;
    $scope.tags.push($scope.input);
    $scope.input = '';
  }
  $scope.removeTag = function (index) {
    $scope.tags.splice(index, 1);
  }
}

function contentCtrl ($scope) {
  $scope.toolbar = {};
}