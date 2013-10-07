/* global console */
/* global chrome */

(function(chrome) {
  'use strict';

  var master,
      slave;

  function syncAll() {
    if (master && slave) {
      console.log('Syncing ' + master + ' -> ' + slave);
      chrome.cookies.getAll({'domain': master, 'session': true }, function(cookies) {
        for (var i = 0; i < cookies.length; i++) {
          var c = cookies[i];
          c.url = 'http://' + slave;
          delete c.session;
          delete c.hostOnly;
          c.domain = slave;
          chrome.cookies.set(c);
        }
      });
    }
  }

  chrome.storage.sync.get(['master', 'slave'], function(items) {
    master = items.master;
    slave = items.slave;
    syncAll();
  });

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    var key;
    for (key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
      if (key === 'master') {
        master = storageChange.newValue;
      } else if (key === 'slave') {
        slave = storageChange.newValue;
      }
    }
    syncAll();
  });

  chrome.cookies.onChanged.addListener(function(info) {
    if (info.cookie.domain === master) {
      syncAll();
    }
  });

  chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({ url: 'popup/index.html', type: 'panel' });
  });

})(chrome);