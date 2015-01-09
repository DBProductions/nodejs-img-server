# NodeJS img server

A simple image server made with NodeJS, it serves images as original or scaled version.
To manipulte the images the npm package `lwip` is used.

## Getting started

Clone the nodejs-img-server repository.

    $ git clone git@github.com:DBProductions/nodejs-img-server.git
    $ cd nodejs-img-server

Install the dependencies.

    $ npm install

Start the server.

    $ node server.js

Put your images into a `orgimages` folder.
The images get served normal when requested.

    http://127.0.0.1:3000/image.jpg

`x` and `y` are possible query parameters to get a scaled image.

    http://127.0.0.1:3000/image.jpg?x=300

The server looks for a image named `x300image.jpg` in the images folder.
When found it serves this file otherwise a file with this name gets created and scaled to the percentge difference of the given parameter and the original size of the image.

## Feedback
Star this repo if you found it useful. Use the github issue tracker to give feedback on this repo.