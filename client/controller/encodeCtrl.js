var app = angular.module('tinyURL', []);
app.controller('encodeCtrl', function($scope, $http) {
    $scope.short_url = '输入长链接以获取短链接';
    $scope.encodeUrl = function(longURL){
      $http({method: 'GET', url: `/encode/${longURL}`}).then(function(response){
        $scope.short_url = response.data;
      });
    };
});
