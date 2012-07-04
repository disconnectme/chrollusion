# Collusion for Chrome (and Safari!)

Collusion for Chrome is a browser extension that lets you visualize the
invisible websites tracking you.

You might fancy [watching a demo](https://www.youtube.com/watch?v=zP79Iwm0xbA)
or [trying the extension](https://disconnect.me/collusion).

Collusion for Chrome is based on [Mozilla’s Firefox add-on
Collusion](https://github.com/toolness/collusion).

## Dev HOWTO

0. Fork this repository.
1. Switch to your working directory of choice.
2. Clone the development repo:

        git clone git@github.com:[username]/chrollusion.git

### In Chrome

3. Go to the wrench menu > **Tools** > **Extensions**.
4. Check **Developer mode** then press **Load unpacked extension...** .
5. Find your working directory.
6. Under `chrollusion.safariextension`, select `chrome`.
7. To test after you make a change, be sure to expand the extension listing then
   press **Reload**.
8. Push your changes.
9. Send us pull requests.

### In Safari

3. Go to **Develop** > **Show Extension Builder**.
4. Click **+** then select **Add Extension...** .
5. Find your working directory.
6. Select `chrollusion.safariextension`.
7. Click **Install** then **Allow**.
8. To test after you make a change, be sure to click **Reload** then **Allow**.
9. Push your changes.
10. Send us pull requests.

## Software used

These libraries are bundled with the project and needn’t be updated manually:

* [jQuery](https://github.com/jquery/jquery)
* [D3.js](https://github.com/mbostock/d3)
* [port.js](https://github.com/disconnectme/port)
* [sitename.js](https://github.com/disconnectme/sitename)
* [favicon.js](https://github.com/disconnectme/favicon)

## License

Copyright 2012 Disconnect, Inc.

This program, including portions developed by Mozilla ([see their
license](https://github.com/toolness/collusion/blob/master/README.md)), is free
software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. [See the GNU General Public
License](https://www.gnu.org/licenses/gpl.html) for more details.
