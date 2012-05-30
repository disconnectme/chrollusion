/**
 * A class for finding a website’s favicon URL, if any. Requires a context, like
 * a browser extension, that allows cross-origin requests.
 * <br />
 * <br />
 * Copyright 2012 Disconnect, Inc.
 * <br />
 * <br />
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * <br />
 * <br />
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the <a
 * href="https://www.gnu.org/licenses/gpl.html">GNU General Public License</a>
 * for more details.
 * <br />
 * @constructor
 * @param {string} [alt] A default favicon URL, absolute or relative.
 * @author <a href="https://github.com/byoogle">Brian Kennish</a>
 */
function Favicon(alt) {
  /**
   * Fetches the default favicon URL.
   * @return {string} An absolute or relative URL.
   */
  this.getAlt = function() { return alt; };

  /**
   * Mungs the default favicon URL.
   * @param  {string}  alt An absolute or relative URL.
   * @return {Favicon}     The favicon object.
   */
  this.setAlt = function(newAlt) {
    alt = newAlt;
    return this;
  };

  /**
   * Finds a favicon URL.
   * @param  {string}           url      A website’s absolute URL or hostname.
   * @param  {function(string)} callback A continuation, to execute when the
   *                                     method completes, that takes a favicon
   *                                     URL.
   * @return {Favicon}                   The favicon object.
   */
  this.get = function(url, callback) {
    var favicon = this.getAlt();
    if (typeof favicon != undeclared) callback(favicon);

    var id = setInterval(function() {
      if (typeof jQuery != undeclared) {
        clearInterval(id);

        if (url.indexOf('/') + 1) {
          anchor.href = url;
          url = anchor.hostname;
        }

        var domain = url.slice(url.indexOf('.') + 1);
        var successful;

        for (var i = 0; i < protocolCount; i++) {
          for (var j = -1; j < subdomainCount; j++) {
            for (var k = 0; k < pathCount; k++) {
              favicon =
                  protocols[i] + (j + 1 ? subdomains[j] + domain : url) +
                      paths[k];

              jQuery.get(favicon, function(data, status, xhr) {
                var type = xhr.getResponseHeader('Content-Type');

                if (!successful && type && type.indexOf('image/') + 1 && data) {
                  successful = true;
                  callback(favicon);
                }
              }).bind(favicon);
            }
          }
        }
      }
    }, 100);

    return this;
  };

  var version = '1.1.1';
  var protocols = ['http://'];
  var subdomains = ['', 'www.'];
  var paths = ['/favicon.ico'];
  var protocolCount = protocols.length;
  var subdomainCount = subdomains.length;
  var pathCount = paths.length;
  var anchor = document.createElement('a');
  var undeclared = 'undefined';

  if (typeof jQuery == undeclared) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'vendor/jquery-1.7.2.min.js');
    script.onload = function() { jQuery.noConflict(); };
    document.head.appendChild(script);
  }

  return this;
}
