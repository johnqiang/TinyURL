var app = angular.module('tinyURL', []);
app.controller('encodeCtrl', function($scope, $http) {
    $scope.short_url = '输入长链接以获取短链接';
    $scope.message = '';
    $scope.encodeUrl = function(longURL){
      $http({method: 'POST', url: '/encode', data: {longURL: longURL}}).then(function(response){
        if (response.data.status == 400 | response.data.status == 404) {
          $scope.message = response.data.result;
        }else {
          $scope.short_url = response.data.result;
        }
      });
    };
});
