# NodeJS img server

A simple image server made with NodeJS, it serves images as original or scaled version.  
To manipulte the images, `lwip` is used, there is no additional programm needed.

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

### Scale

    http://127.0.0.1:3000/image.jpg?x=300
    http://127.0.0.1:3000/image.jpg?y=200

### Rotate

    http://127.0.0.1:3000/image.jpg?action=rotate&degs=45

### Crop

    http://127.0.0.1:3000/image.jpg?action=crop&left=0&top=0&right=20&bottom=50

### Blur

    http://127.0.0.1:3000/image.jpg?action=blur&sigma=1.0

### Sharpen

    http://127.0.0.1:3000/image.jpg?action=sharpen&amplitude=1.0

### Mirror

    http://127.0.0.1:3000/image.jpg?action=mirror&axes=x

### Border
    
    http://127.0.0.1:3000/image.jpg?action=border&width=5&color=black

The server looks for a image named specific to the requested parameters in the images folder.  
When found it serves this file otherwise a file with this name gets created.

## Feedback
Star this repo if you found it useful. Use the github issue tracker to give feedback on this repo.