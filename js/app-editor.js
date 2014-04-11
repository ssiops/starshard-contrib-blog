function tagsCtrl ($scope) {
  $scope.tags = [];
  $scope.input = '';
  $scope.focus = false;
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

function contentCtrl ($scope, $window) {
  $scope.toolbar = {};
  $scope.textarea = $window.document.getElementById('body');
  $scope.value = '';
  $scope.insert = function(opt) {
    var start = $scope.textarea.selectionStart;
    var end = $scope.textarea.selectionEnd;
    if (opt.wrap) {
      if (start === end)
        $scope.value = $scope.value.substring(0, start) + opt.wrap + opt.wrap + $scope.value.substring(end, $scope.value.length);
      else
        $scope.value = $scope.value.substring(0, start) + opt.wrap + $scope.value.substring(start, end) + opt.wrap + $scope.value.substring(end, $scope.value.length);
      $scope.textarea.selectionStart = $scope.textarea.selectionEnd = start + opt.wrap.length;
    }
    if (opt.home) {
      var br = start - 1;
      for (; br >= 0 && $scope.value.charAt(br) != '\n'; br--);
      $scope.value = $scope.value.substring(0, br) + opt.home + $scope.value.substring(br, $scope.value.length);
      $scope.textarea.selectionStart = $scope.textarea.selectionEnd = start + opt.home.length;
    }
    if (opt.line) {
      $scope.value = $scope.value.substring(0, start) + '\n' + opt.line + '\n' + $scope.value.substring(start, $scope.value.length);
      $scope.textarea.selectionStart = $scope.textarea.selectionEnd = start + opt.line.length + 2;
    }
    if (opt.simple) {
      $scope.value = $scope.value.substring(0, start) + opt.simple + $scope.value.substring(start, $scope.value.length);
    }
    $scope.textarea.focus();
  }
}