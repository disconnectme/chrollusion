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
4. Press **Load unpacked extension...** .
5. Find your working directory.
6. Under `chrollusion.safariextension`, select `chrome`.
7. To test after you make a change, be sure to expand the extension listing then
   press **Reload**.
8. Push your changes.
9. Send us pull requests.

### In Safari

TODO.

## Software used

These libraries are bundled with the project and needn’t be updated manually:

* [jQuery](https://github.com/jquery/jquery)
* [D3.js](https://github.com/mbostock/d3)
* [port.js](https://github.com/disconnectme/port)
