(function(angular) {
  'use strict';

  angular.module('CookieMirrorApp', ['ng', 'ce'])

    .controller('CurrentWebsiteCtrl', [
      '$scope', '$q', 'ceStorage', 'ceCookies', 'test',
      function($scope, $q, ceStorage, ceCookies, test) {
        $scope.wtf = test;
        $q.all([
          ceStorage,
          ceCookies
        ]).then(function(data) {
          var options = data[0],
              cookies = data[1];

          $scope.master = options.sync.master;
          $scope.slave = options.sync.slave;
          $scope.cookies = {};

          angular.forEach(cookies[$scope.master], function(cookie, name) {
            var slave = cookies[$scope.slave][name];
            $scope.cookies[name] = {
              master: cookie.value,
              slave: slave ? slave.value : undefined
            };
          });
        });

      }
    ])

    ;

})(angular);