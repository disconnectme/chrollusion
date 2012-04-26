# Collusion for Chrome (and Safari!)

Collusion for Chrome is a browser extension that lets you visualize the
invisible websites tracking you.

You might fancy [watching a demo](https://www.youtube.com/watch?v=zP79Iwm0xbA)
or [trying the extension](https://disconnect.me/collusion).

Collusion for Chrome is based on [Mozilla’s Firefox add-on
Collusion](https://github.com/toolness/collusion).

## Dev HOWTO

1. Switch to your working directory of choice.
2. Clone the development repository:

        git clone git://github.com/disconnectme/chrollusion.git

### In Chrome

3. Go to the wrench menu > **Tools** > **Extensions**.
4. Press **Load unpacked extension...**.
5. Find your working directory.
6. Under `chrollusion.safariextension`, select `chrome`.
7. To test your changes, be sure to expand the extension listing then press
   **Reload**.

### In Safari

TODO.

## Software used

These libraries are bundled with the repo and needn’t be updated manually:

* [jQuery](https://github.com/jquery/jquery)
* [D3.js](https://github.com/mbostock/d3)
* [port.js](https://github.com/disconnectme/port)
