var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    querystring = require('querystring'),
    lwip = require('lwip'),
    port = 3000;
/**
 * creat a filename based on the query params
 */
function createModFileName(params, fileName) {
    var extra = '';
    if (params.action) {
        extra += params.action; 
        if (params.left) {
            extra += params.left; 
        }
        if (params.top) {
            extra += params.top; 
        }
        if (params.right) {
            extra += params.right; 
        }
        if (params.bottom) {
            extra += params.bottom; 
        }
    }
    if (params.x) {
        extra += 'x' + params.x; 
    }
    if (params.y) {
        extra += 'y' + params.y; 
    }
    if (params.degs) {
        extra += 'degs' + params.degs; 
    }
    return './images/' + extra + fileName;
}
/**
 * handle image and do different manipulations
 */
function handleImage(params, image, cb) {
    if (params.action === 'rotate') {
        if (params.degs) {
            var degs = parseFloat(params.degs);
            image.rotate(degs, 'white', function(err, image) {
                cb(image);
            });
        } else {
            cb(image);
        }
    } else if (params.action === 'crop') {
        var left = parseInt(params.left, 10) || 0;
        var top = parseInt(params.top, 10) || 0;
        var right = parseInt(params.right, 10) || 0;
        var bottom = parseInt(params.bottom, 10) || 0;
        image.crop(left, top, right, bottom, function(err, image) {
            cb(image);
        });
    } else {
        var scale = calculateScale(params, image);
        image.scale(scale, function(err, image) {
            cb(image);
        });
    }
}
/**
 * calculate the scale of the image
 */
function calculateScale(params, image) {
    if (params.x) {
        return Math.floor((100/image.width()) * params.x) / 100;
    }
    if (params.y) {
        return Math.floor((100/image.height()) * params.y) / 100;
    }
    return 1.0;
}

http.createServer(function (request, response) {
    var reqUrl = url.parse(request.url);
    var params = querystring.parse(reqUrl.query);
    var fileName = reqUrl.pathname.slice(1);

    var filePath = 'notexists';
    if (reqUrl.pathname !== '/') {
        filePath = './orgimages' + reqUrl.pathname;
    }    

    var modFilePath;
    if (reqUrl.query !== null) {
        modFilePath = createModFileName(params, fileName);
    }

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.jpg':
            contentType = 'image/jpeg';
            imgType = 'jpg';
            imgOps = {quality: 90};
            break;
        case '.png':
            contentType = 'image/png';
            imgType = 'png';
            imgOps = {};
            break;
        case '.gif':
            contentType = 'image/gif';
            imgType = 'gif';
            imgOps = {};
            break;
    }
     
    fs.exists(filePath, function(orgExists) {   
        if (orgExists === true) {
            // deliver original image
            if (!modFilePath) {
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        console.log('error read image', filePath);
                        response.writeHead(500);
                        response.end();
                    } else {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content);
                    }
                });
            } else {
                fs.exists(modFilePath, function(exists) {
                    if (exists === true) {
                        fs.readFile(modFilePath, function(error, content) {
                            if (error) {
                                console.log('error read modified image');
                                response.writeHead(500);
                                response.end();
                            } else {
                                response.writeHead(200, { 'Content-Type': contentType });
                                response.end(content);
                            }       
                        }); 
                    } else {
                        lwip.open(filePath, function(err, image) {
                            handleImage(params, image, function(image) {
                                image.toBuffer(imgType, imgOps, function(err, buffer) {
                                    // deliver modified image
                                    response.end(buffer);
                                    // save modified image to disc
                                    fs.writeFile(modFilePath, buffer, function(err) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            console.log("The file is saved!");
                                        }
                                    });
                                });
                            });
                        });                        
                    }
                }); 
            }
        } else {
            if (contentType === 'text/html') {
                response.end('<html><body><h1>Error</h1><p>No image gets requested!</p></body></html>');
            } else {
                console.log('original image not exists'); 
                response.writeHead(500);
                response.end();
            }            
        }
    });
}).listen(port);
console.log('webserver listen on port: ' + port);