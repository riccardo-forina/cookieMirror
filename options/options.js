/* global chrome */
(function(chrome) {
  'use strict';

  // Saves options to localStorage.
  function saveOptions() {
    var master = document.getElementById('master').value,
        slave = document.getElementById('slave').value;

    chrome.storage.sync.set({
      master: master,
      slave: slave
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.innerHTML = 'Options Saved.';
      setTimeout(function() {
        status.innerHTML = '';
      }, 750);
    });

  }

  // Restores select box state to saved value from localStorage.
  function restoreOptions() {
    chrome.storage.sync.get(['master', 'slave'], function(items) {
      document.getElementById('master').value = items.master || '';
      document.getElementById('slave').value = items.slave || '';
    });
  }
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector('#save').addEventListener('click', saveOptions);

})(chrome);