(function(angular) {
  'use strict';

  angular.module('CookieMirrorApp', ['ng', 'ce'])

    .controller('CurrentWebsiteCtrl', [
      '$scope', '$log', 'ceStorage', 'ceCookies',
      function($scope, $log, ceStorage, ceCookies) {
        function extractCookies() {
          if (!$scope._cookies.cookies || !$scope.master || !$scope.slave) {
            return;
          }
          $scope.cookies = {};
          angular.forEach($scope._cookies.cookies[$scope.master], function(cookie, name) {
            var slave = $scope._cookies.cookies[$scope.slave][name];
            $scope.cookies[name] = {
              master: cookie.value,
              slave: slave ? slave.value : undefined
            };
          });
        }

        $scope._storage = ceStorage;
        $scope._cookies = ceCookies;

        $scope.$watch('_storage', function(storage) {
          $scope.master = storage.sync.master;
          $scope.slave = storage.sync.slave;
          extractCookies();
        }, true);
        $scope.$watch('_cookies', function() {
          extractCookies();
        }, true);
      }
    ])

    ;

})(angular);