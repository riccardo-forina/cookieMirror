// Copyright (c) 2013 Riccardo Forina

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/* global angular */
/* global chrome */

(function(angular, chrome) {
  'use strict';

  angular.module('ce', ['ce-storage']);

  angular.module('ce-storage', ['ng'])

    .factory('ceStorage', [
      '$rootScope', '$browser', '$q',
      function($rootScope, $browser, $q) {
        var defer = $q.defer();

        var storage = {
          local: {},
          sync: {}
        };
        function sync(what) {
          chrome.storage[what].get(null, function(items) {
            storage[what] = items;
            // $rootScope.$apply();
          });
        }

        function syncAll() {
          sync('local');
          sync('sync');
          defer.resolve(storage);
          $rootScope.$apply();
        }

        // chrome.storage.onChanged.addListener(function(changed, areaName) {
        //   sync(areaName);
        // });
        // $browser.addPollFn(syncAll);

        syncAll();

        return defer.promise;
      }
    ])

    .factory('ceCookies', [
      '$rootScope', '$browser', '$q',
      function($rootScope, $browser, $q) {
        var defer = $q.defer();

        function sync() {
          chrome.cookies.getAll({}, function(data) {
            var cookies = {};
            data.forEach(function(cookie) {
              var val = cookies[cookie.domain] || {};
              val[cookie.name] = cookie;
              cookies[cookie.domain] = val;
            });
            defer.resolve(cookies);
            $rootScope.$apply();
          });
        }

        // chrome.cookies.onChanged.addListener(sync);
        // $browser.addPollFn(sync);

        sync();

        return defer.promise;
      }
    ])

    ;

})(angular, chrome);