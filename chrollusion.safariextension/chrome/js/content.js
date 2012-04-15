/*
  A content script that flags tracking requests.

  Copyright 2012 Disconnect, Inc.

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
*/

/* Parses a URL into a domain name and hostname, regex free. */
function getDomain(url) {
  anchor.href = url;
  var host = anchor.hostname;
  var labels = host.split('.');
  return {
    name:
        isNaN(parseFloat(labels[labels.length - 1])) ?
            labels.splice(-2).join('.') : host,
                // IP addresses should't be munged.
    host: host
  };
}

/* Constants. */
var extension = chrome.extension;
var sendRequest = extension.sendRequest;
var anchor = document.createElement('a');
var animate = true;

/*
  Raises tracking requests. We define a tracking request broadly because there
  are many ways to track besides cookies (IP addresses, LSOs, browser
  fingerprinting, to name a few) and we don't bug the user with sound effects.
*/
sendRequest({initialized: true}, function(response) {
  var extensionId = getDomain(extension.getURL('')).name;
  var referrerDomain = getDomain(response.referrerUrl);
  var referrerName = referrerDomain.name;
  var referrerHost = referrerDomain.host;

  document.addEventListener('beforeload', function(event) {
    var domain = getDomain(event.url);
    var name = domain.name;
    name && name != extensionId && name != referrerName &&
        sendRequest({
          domain: {name: name, host: domain.host},
          referrerDomain: {name: referrerName, host: referrerHost},
          type: event.target.nodeName.toLowerCase(),
          animate: animate && !(animate = false)
        });
  }, true);
});
