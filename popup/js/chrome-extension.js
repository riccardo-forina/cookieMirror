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

    .service('ceStorage', [
      '$rootScope', '$browser', '$log',
      function($rootScope, $browser, $log) {
        var self = this;

        self.local = {};
        self.sync = {};

        function sync(what) {
          chrome.storage[what].get(null, function(items) {
            self[what] = items;
          });
        }

        function syncAll() {
          sync('local');
          sync('sync');
          if (!$rootScope.$$phase) {
            // $log.log('$apply');
            $rootScope.$apply();
          }
        }

        chrome.storage.onChanged.addListener(function(changed, areaName) {
          sync(areaName);
        });
        syncAll();
        // $browser.addPollFn(syncAll);
      }
    ])

    .service('ceCookies', [
      '$rootScope', '$browser', '$log',
      function($rootScope, $browser, $log) {
        var self = this;

        self.cookies = {};

        function setCookie(cookie) {
          var val = self.cookies[cookie.domain] || {};
          val[cookie.name] = cookie;
          self.cookies[cookie.domain] = val;
        }

        function deleteCookie(cookie) {
          var val = self.cookies[cookie.domain] || {};
          delete val[cookie.name];
          self.cookies[cookie.domain] = val;
        }

        function sync() {
          chrome.cookies.getAll({}, function(cookies) {
            self.cookies = {};
            cookies.forEach(setCookie);
            if (!$rootScope.$$phase) {
              // $log.log('$apply');
              $rootScope.$apply();
            }
          });
        }

        chrome.cookies.onChanged.addListener(function(info) {
          $log.info((info.removed ? 'Removed' : 'Changed [' + info.cause + ']') + ' cookie ' + info.cookie.domain + ':' + info.cookie.name);
          if (info.removed) {
            deleteCookie(info.cookie);
          } else {
            setCookie(info.cookie);
          }
          if (!$rootScope.$$phase) {
            // $log.log('$apply');
            $rootScope.$apply();
          }
        });
        // $browser.addPollFn(sync);
        sync();
      }
    ])

    ;

})(angular, chrome);