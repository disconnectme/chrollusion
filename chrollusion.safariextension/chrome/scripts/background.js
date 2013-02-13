/*
  A background page that aggregates tracking requests.

  Copyright 2012, 2013 Disconnect, Inc.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Brian Kennish <byoogle@gmail.com>
    Jeremy Singer-Vine <jsvine@gmail.com>
    Gary Teh <garyjob@gmail.com>    
    William Estoque <william.estoque@gmail.com>
*/

/* Destringifies an object. */
function deserialize(object) {
  return typeof object == 'string' ? JSON.parse(object) : object;
}

/* Picks a random animation path. */
function getScene() {
  return scenes.splice(Math.floor(Math.random() * scenes.length), 1)[0];
}

/* Constants. */
var extension = chrome.extension;
var browserAction = chrome.browserAction;
var setIcon = browserAction.setIcon;
var setBadgeText = browserAction.setBadgeText;
var tlds = deserialize(localStorage.tlds) || {};
var services = deserialize(localStorage.services) || {};
var whitelist = deserialize(localStorage.whitelist) || {};
var blacklist = deserialize(localStorage.blacklist) || {};
var tabs = {};
var log = {};
var playback = [];
var currentBuild = 29;
var previousBuild = localStorage.build;
var startTime;
var scenes = [1, 2, 3, 4, 5];
var currentScene = getScene();
var frameCount = 7;
var frameLength = 100;
var fileExtension = '.png';
var atr = new analytics();
var recommender = new recommends();

if (!previousBuild || previousBuild < 15) localStorage.promoHidden = true;
if (!previousBuild || previousBuild < 18) localStorage.updateClosed = true;

if (!previousBuild || previousBuild < 25) {
  delete localStorage.promoHidden;
  delete localStorage.updateClosed;
}

if (!previousBuild || previousBuild < 26) {
  delete localStorage.blacklist;
  blacklist = {};
}

if (!previousBuild || previousBuild < 27)
    if (!SAFARI) localStorage.updateClosed = true;
if (!previousBuild || previousBuild < currentBuild)
    localStorage.build = currentBuild;
parseInt(localStorage.sidebarCollapsed, 10) &&
    localStorage.sidebarCollapsed--; // An experimental "semisticky" bit.

$.getJSON('../data/tlds.json', function(data) {
  tlds = data;

  $.get(
    'https://mxr.mozilla.org/mozilla-central/source/netwerk/dns/effective_tld_names.dat?raw=1',
    function(data) {
      data = data.split('\n');
      var lineCount = data.length;

      for (var i = 0; i < lineCount; i++) {
        var line = $.trim(data[i]);

        if (line && line.slice(0, 2) != '//') {
          var prefix = line.charAt(0);

          // Fancy syntax is fancy.
          if (prefix == '*' || prefix == '!') line = line.slice(1);
          if (line.charAt(0) == '.') line = line.slice(1);

          tlds[line] = true;
        }
      }

      localStorage.tlds = JSON.stringify(tlds);
    }
  );
});

// TODO: This file is already loaded elsewhere.
$.getJSON('../data/trackers.json', function(data) {
  var siteCount = data.length;
  var servicesUpdate = {};
  for (var i = 0; i < siteCount; i++) servicesUpdate[data[i].domain] = true;
  services = servicesUpdate;
  localStorage.services = JSON.stringify(services);
});

setIcon({
  path:
      (SAFARI ? 'chrome' : '') + '/images/' + currentScene + '/1' +
          fileExtension
});
browserAction.setBadgeBackgroundColor({color: [214, 39, 40, 255]});
SAFARI || deserialize(localStorage.promoHidden) ||
    !deserialize(localStorage.updateClosed) && setBadgeText({text: 'NEW!'});

/* Restricts the toolbar animation to 1x per load of the topmost window. */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  changeInfo.status == 'loading' && delete tabs[tabId];
});

/* Refreshes the data and graph if open. */
extension.onRequest.addListener(function(request, sender, sendResponse) {
  var tab = sender.tab;
  
  //  Sends event data from content script sources back home
  if (request.track) {
    //Do not track
    if (!deserialize(localStorage.recommendsExperiment) || deserialize(localStorage.recommendsClosed)) {
      return;
    }
    if (request.track.prop) {
      if (!localStorage['chrollusion_first_action']) {
        localStorage['chrollusion_first_action'] = '1';
        request.track.prop.action = request.track.name;
        atr.triggerEvent('chrollusion first action on modal', request.track.prop);
      }
      atr.triggerEvent(request.track.name, request.track.prop);
    } else {
      atr.triggerEvent(request.track.name);
    }
    return;
  }
  
  if (request.initialized) {
    if (!startTime) startTime = new Date();
    sendResponse({
      tlds: tlds,
      referrerUrl: tab.url,
      trackingBlocked: !deserialize(localStorage.trackingUnblocked),
      services: services,
      whitelist: whitelist,
      blacklist: blacklist
    });
  } else {
    // The Collusion data structure.
    var domain = request.domain;
    var domainName = domain.name;
    if (!(domainName in log))
        log[domainName] = {host: domain.host, referrers: {}, visited: false};

    var referrerDomain = request.referrerDomain;
    var referrerName = referrerDomain.name;
    var referrerHost = referrerDomain.host;
    if (!(referrerName in log))
        log[referrerName] = {host: referrerHost, referrers: {}};
    log[referrerName].visited = true;

    var referrers = log[domainName].referrers;
    var elapsedTime = new Date() - startTime;
    if (!(referrerName in referrers))
        referrers[referrerName] = {
          host: referrerHost,
          types: [elapsedTime]
        };

    var types = referrers[referrerName].types;
    var type = request.type;
    types.indexOf(type) == -1 && types.push(type);

    // For art.
    playback.push({time: elapsedTime, domain: domainName});

    // A live update.
    var popup = extension.getViews({type: 'popup'})[0];
    popup && popup.graph && popup.graph.update(log);

    // Animation.
    var tabId = tab.id;

    if (!(tabId in tabs) && request.animate) {
      tabs[tabId] = {};
      for (var i = 0; i < frameCount - 1; i++)
          setTimeout(function(scene, index) {
            setIcon({
              path:
                  (SAFARI ? 'chrome' : '') + '/images/' + scene + '/' +
                      (index + 2) + fileExtension
            });
          }, i * frameLength, currentScene, i);
      var previousScene = currentScene;
      currentScene = getScene();
      scenes.push(previousScene);
      for (var i = 0; i < frameCount; i++)
          setTimeout(function(scene, index) {
            setIcon({
              path:
                  (SAFARI ? 'chrome' : '') + '/images/' + scene + '/' +
                      (frameCount - index) + fileExtension
            });
          }, (i + frameCount - 1) * frameLength, currentScene, i);
    }

    var domainNames = tabs[tabId];
    domainNames[domainName] = ++domainNames[domainName] || 1;
        // A count, for future use.
    SAFARI || deserialize(localStorage.badgeHidden) ||
        (deserialize(localStorage.promoHidden) ||
            deserialize(localStorage.updateClosed)) &&
                setBadgeText({
                  text: Object.keys(domainNames).length + '', tabId: tabId
                });

    // Cleanup.
    sendResponse({});
  }
});
