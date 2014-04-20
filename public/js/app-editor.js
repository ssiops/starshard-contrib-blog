angular.module('blog', ['angularFileUpload', 'ui.bootstrap']).
  factory('$alertService', ['$rootScope', function ($rootScope) {
    return alertService($rootScope);
  }]);

function editorCtrl ($scope, $window, $http, $modal, $alertService) {
  $scope.err = {};
  $scope.tags = [];
  $scope.prevTags = [];
  $scope.input = '';
  $scope.focus = false;
  var tags = angular.element($window.document.getElementById('blog-tags')).attr('data-value');
  if (tags && tags.length > 0)
    $scope.tags = tags.split(',');
  $scope.addTag = function () {
    if ($scope.input.length < 1) return;
    if ($scope.tags.indexOf($scope.input) >= 0) return;
    $scope.tags.push($scope.input);
    $scope.input = '';
  }
  $scope.removeTag = function (index) {
    $scope.tags.splice(index, 1);
  }

  $scope.toolbar = {};
  $scope.textarea = $window.document.getElementById('body');
  $scope.value = '';
  $scope.insert = function(opt) {
    $scope.value = $scope.textarea.value;
    var start = $scope.textarea.selectionStart;
    var end = $scope.textarea.selectionEnd;
    if (opt.wrap) {
      if (start === end)
        $scope.textarea.value = $scope.value.substring(0, start) + opt.wrap + opt.wrap + $scope.value.substring(end, $scope.value.length);
      else
        $scope.textarea.value = $scope.value.substring(0, start) + opt.wrap + $scope.value.substring(start, end) + opt.wrap + $scope.value.substring(end, $scope.value.length);
      $scope.textarea.selectionStart = $scope.textarea.selectionEnd = start + opt.wrap.length;
    }
    if (opt.home) {
      var br = start - 1;
      for (; br >= 0 && $scope.value.charAt(br) != '\n'; br--);
      br++;
      $scope.textarea.value = $scope.value.substring(0, br) + opt.home + $scope.value.substring(br, $scope.value.length);
      $scope.textarea.selectionStart = $scope.textarea.selectionEnd = start + opt.home.length;
    }
    if (opt.line) {
      $scope.textarea.value = $scope.value.substring(0, start) + '\n' + opt.line + '\n' + $scope.value.substring(start, $scope.value.length);
      $scope.textarea.selectionStart = $scope.textarea.selectionEnd = start + opt.line.length + 2;
    }
    if (opt.simple) {
      $scope.textarea.value = $scope.value.substring(0, start) + opt.simple + $scope.value.substring(start, $scope.value.length);
    }
    $scope.textarea.focus();
  }
  $scope.submit = function () {
    var blog = {
      'title': $scope.title,
      'abstract': $scope.abstract,
      'tags': $scope.tags,
      'body': $scope.textarea.value
    }
    $scope.err = {}
    if (blog.title.length < 4) {
      $scope.err.title = true;
      return;
    }
    if (blog.abstract.length < 4) {
      $scope.err.title = true;
      return;
    }
    if (blog.body.length < 20) {
      $scope.err.body = true;
      return;
    }
    $http.put('/blog/archive', blog).success(function (data, status) {
      if (data && data.redirect) {
        $window.location.href = '/blog/archive/' + data.redirect + '/';
      }
      if (data.msg)
        $alertService.send(data.msg);
    });
  }
  $scope.getTags = function () {
    $http.get('/blog/archive/tags').success(function (data, status) {
      if (data.list)
        $scope.prevTags = data.list;
      if (data.msg)
        $alertService.send(data.msg);
    });
  }
  $scope.openModal = function () {
    var modalInstance = $modal.open({
      templateUrl: 'imgUpload.html',
      controller: modalCtrl
    });

    modalInstance.result.then(function (src) {
      $scope.insert({simple: '![ALT](' + src + ')'});
    }, function () {
    });
  }

  $scope.getTags()
}

function modalCtrl ($scope, $modalInstance, $fileUploader) {
  $scope.ok = function () {
    $modalInstance.close();
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  }

  $scope.uploader = $fileUploader.create({
    scope: $scope,
    url: '/usercontent/blog/img',
    autoUpload: true
  });

  $scope.uploader.progress = 0;

  $scope.uploader.bind('success', function (event, xhr, item, response) {
    $modalInstance.close('/usercontent/blog/' + response.filename);
  });
}