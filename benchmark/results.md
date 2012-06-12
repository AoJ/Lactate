<<<<<<< HEAD
Tue Jun 12 03:00:01 PDT 2012

# Node.js static file handler benchmark comparison

This comparison has three tests

+ `/jquery.min.js` *~100kb*
+ `/santamonica.jpg` *~1mb*
+ `/asdf` (Invalid request)

Tested modules were 

+ Lactate
+ bastard
+ connect
+ lightnode
+ node-static
+ paperboy
+ static-resource

Implementations were standard; potential optimizations exist for the various modules.
Further testing may compare various other request paths & file types.

Response headers were discovered using
=======
Sun Jun 10 22:59:00 PDT 2012

# Node.js static file handler benchmark comparison

This comparison tests requests to `/jquery.min.js` (200 status) and `/` (404).
Implementations were standard; potential optimizations exist for the various modules.
Further testing may compare various other request paths & file types.

`cURL headers` were discovered using
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

```
curl -I
```

<<<<<<< HEAD
Bench results come from three runs of apache bench

```
ab -c 100 -n 10000
=======
`Trials` results come from three runs of apache bench

```
ab -n 10000
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
```

Without server restarts in-between trials

<<<<<<< HEAD
![jquery & santamonica graph](http://i.imgur.com/jFRb9.jpg)

## Lactate

*First commit* Jun 05, 2012

*Latest commit* Jun 10, 2012

[https://github.com/Weltschmerz/Lactate](https://github.com/Weltschmerz/Lactate)

```js
var lactate = require('lactate')
var files = lactate.dir('../../files')

var http = require('http')
var server = new http.Server()

server.addListener('request', function(req, res) {
    return files.serve(req, res) 
=======
*/jquery.min.js results*

![Graph of the /jquery.min.js results](http://i.imgur.com/vI9bf.png)

## bastard

*First commit* Dec 03, 2011

*Latest commit* Mar 11, 2012

[https://github.com/unprolix/bastard](https://github.com/unprolix/bastard)

```js
var bastard = require('bastard')
var Bastard = bastard.Bastard

var bastardObj = new Bastard({
  base:'../files',
  fingerprintURLPrefix:'/f/',
  urlPrefix:'/',
  rawURLPrefix:'/raw/'
})

bastardObj.preload(function() { })

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
  bastardObj.possiblyHandleRequest(req, res)
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
})

server.listen(8080)
```

<<<<<<< HEAD
### /jquery.min.js
=======
### 200 /jquery.min.js
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

*cURL headers*

```
<<<<<<< HEAD
HTTP/1.1 200 OK
Content-Type: application/javascript
Content-Encoding: gzip
Last-Modified: Sun, 10 Jun 2012 07:29:37 GMT
Connection: keep-alive
```

*Bench*

```
Document Length:        33673 bytes
Requests per second:    2825.74 [#/sec] (mean)
```

### /santamonica.jpg

*cURL headers*

```
HTTP/1.1 200 OK
Content-Type: image/jpeg
Content-Encoding: gzip
Last-Modified: Mon, 11 Jun 2012 12:33:46 GMT
Connection: keep-alive
```

*Bench*

```
Document Length:        999268 bytes
Requests per second:    1145.96 [#/sec] (mean)
```

### /asdf

*cURL headers*

```
HTTP/1.1 404 Not Found
Connection: keep-alive
```

*Bench*

```
Document Length:        0 bytes
Requests per second:    4400.29 [#/sec] (mean)
=======
HTTP/1.1 200 OK
Content-Length: 0
Content-Type: text/plain; charset=UTF-8
Vary: Accept-Encoding
Cache-Control: max-age=null
Server: bastard/0.6.8
Last-Modified: Sun Jun 10 2012 07:40:12 GMT-0700 (PDT)
Etag: 47b68dce8cb6805ad5b3ea4d27af92a241f4e29a5c12a274c852e4346a0500b4
Connection: keep-alive
```


*Document length*

```
Document Length:        94840 bytes
```

*Trials*

```
Requests per second:    546.11 [#/sec] (mean)
Requests per second:    548.67 [#/sec] (mean)
Requests per second:    547.11 [#/sec] (mean)
```

### 404 /

*cURL headers*

```
HTTP/1.1 404 Not Found
Content-Type: text/plain; charset=utf-8
Server: bastard/0.6.8
Connection: keep-alive
```

*Document length*

```
Document Length:        15 bytes
```

*Trials*

```
Requests per second:    1659.73 [#/sec] (mean)
Requests per second:    1765.67 [#/sec] (mean)
Requests per second:    1652.71 [#/sec] (mean)
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
```

### Notes

<<<<<<< HEAD
+ Fastest module at serving `jquery.min.js` requests
+ Only of the tested modules that gzips
+ Document Length is 1 / 2.8 the size of other modules


## bastard

*First commit* Dec 03, 2011

*Latest commit* Mar 11, 2012

[https://github.com/unprolix/bastard](https://github.com/unprolix/bastard)

```js
var bastard = require('bastard')
var Bastard = bastard.Bastard

var bastardObj = new Bastard({
  base:'../../files',
  fingerprintURLPrefix:'/f/',
  urlPrefix:'/',
  rawURLPrefix:'/raw/'
})
=======
+ Passing "[default configuration](https://github.com/unprolix/bastard#configuration)" to `new Bastard()` was necessary
+ Failed to serve .js files, served .txt instead
+ Content-Length for cURL was `0 bytes` for valid `jquery.min.js` requests
+ Uses `Date()` instead of `new Date().toUTCString()` for  `Last-Modified` headers
+ Sets `Cache-Control` headers with or without a value

## connect

*First commit* Jun 16, 2011

*Latest commit* Jun 10, 2012

[http://www.senchalabs.org/connect/static.html](http://www.senchalabs.org/connect/static.html)

[https://github.com/senchalabs/connect/commits/master/lib/middleware/static.js](https://github.com/senchalabs/connect/commits/master/lib/middleware/static.js)

```js
var connect = require('connect')
var files = connect.static('../files')
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

var http = require('http')
var server = new http.Server

<<<<<<< HEAD
server.addListener('request', function(req, res) {
  bastardObj.possiblyHandleRequest(req, res)
})
=======
server.addListener('request', files)
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

server.listen(8080)
```

<<<<<<< HEAD
### /jquery.min.js

*cURL headers*

```
HTTP/1.1 200 OK
Content-Length: 0
Content-Type: application/javascript; charset=utf-8
Vary: Accept-Encoding
Cache-Control: max-age=null
Server: bastard/0.6.8
Last-Modified: Sun Jun 10 2012 00:29:37 GMT-0700 (PDT)
Etag: 47b68dce8cb6805ad5b3ea4d27af92a241f4e29a5c12a274c852e4346a0500b4
Connection: keep-alive
```

*Bench*

```
Document Length:        94544 bytes
Requests per second:    664.07 [#/sec] (mean)
```

### /santamonica.jpg
=======
### 200 /jquery.min.js
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

*cURL headers*

```
<<<<<<< HEAD
HTTP/1.1 200 OK
Content-Length: 0
Content-Type: image/jpeg
Vary: Accept-Encoding
Cache-Control: max-age=null
Server: bastard/0.6.8
Last-Modified: Mon Jun 11 2012 05:33:46 GMT-0700 (PDT)
Etag: 62557bc0fcad63c5be8f8464ef8e0fa5667272f1cd8d6d203dc9069759656409
Connection: keep-alive

```

*Bench*

```
Document Length:        1051367 bytes
Requests per second:    1093.25 [#/sec] (mean)
```

### /asdf

*cURL headers*

```
HTTP/1.1 404 Not Found
Content-Type: text/plain; charset=utf-8
Server: bastard/0.6.8
Connection: keep-alive
```

*Bench*

```
Document Length:        15 bytes
Requests per second:    3945.08 [#/sec] (mean)
```

### Notes

+ Passing "[default configuration](https://github.com/unprolix/bastard#configuration)" to `new Bastard()` was necessary
+ Content-Length for cURL was `0 bytes` for valid `jquery.min.js` requests
+ Uses relative date string for `Last-Modified` header
+ Sets `Cache-Control` headers with or without a value

## connect

*First commit* Jun 16, 2011

*Latest commit* Jun 10, 2012

[http://www.senchalabs.org/connect/static.html](http://www.senchalabs.org/connect/static.html)

[https://github.com/senchalabs/connect/commits/master/lib/middleware/static.js](https://github.com/senchalabs/connect/commits/master/lib/middleware/static.js)

```js
```

### /jquery.min.js

*cURL headers*

```
HTTP/1.1 200 OK
Date: Mon, 11 Jun 2012 16:45:26 GMT
Cache-Control: public, max-age=0
Last-Modified: Sun, 10 Jun 2012 07:29:37 GMT
Content-Type: application/javascript
Accept-Ranges: bytes
Content-Length: 94840
Connection: keep-alive
```

*Bench*

```
Document Length:        94840 bytes
Requests per second:    1235.85 [#/sec] (mean)
```

### /santamonica.jpg

*cURL headers*

```
HTTP/1.1 200 OK
Date: Mon, 11 Jun 2012 16:45:43 GMT
Cache-Control: public, max-age=0
Last-Modified: Mon, 11 Jun 2012 12:33:46 GMT
Content-Type: image/jpeg
Accept-Ranges: bytes
Content-Length: 1051367
Connection: keep-alive
```

*Bench*

```
Document Length:        1051367 bytes
Requests per second:    277.40 [#/sec] (mean)
```

### asdf
=======
HTTP/1.1 200 OK
Date: Sun, 10 Jun 2012 14:06:47 GMT
Cache-Control: public, max-age=0
Last-Modified: Sun, 10 Jun 2012 07:29:37 GMT
Content-Type: application/javascript
Accept-Ranges: bytes
Content-Length: 94840
Connection: keep-alive
```

*Document length*

```
Document Length:        94840 bytes
```

*Trials*

```
Requests per second:    734.53 [#/sec] (mean)
Requests per second:    762.04 [#/sec] (mean)
Requests per second:    770.62 [#/sec] (mean)
```

### 404 /

### Notes

+ 404 requests are unamenable to this method
+ Sets `Cache-Control` headers with or without a value
+ Part of a much larger framework

## Lactate

*First commit* Jun 05, 2012

*Latest commit* Jun 10, 2012

[https://github.com/Weltschmerz/Lactate](https://github.com/Weltschmerz/Lactate)

```js
var lactate = require('lactate')
var files = lactate.dir('../files')

var http = require('http')
var server = new http.Server()

server.addListener('request', function(req, res) {
    return files.serve(req, res) 
})

server.listen(8080)
```

### 200 /jquery.min.js

*cURL headers*

```
HTTP/1.1 200 OK
Content-Type: application/javascript
Content-Encoding: gzip
Last-Modified: Fri, 08 Jun 2012 10:22:35 GMT
Connection: keep-alive

```

*Document length*

```
Document Length:        33673 bytes
```

*Trials*

```
Requests per second:    1877.07 [#/sec] (mean)
Requests per second:    1900.47 [#/sec] (mean)
Requests per second:    1903.94 [#/sec] (mean)
```

### 404 /
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

*cURL headers*

```
<<<<<<< HEAD
HTTP/1.1 404 Not Found
Connection: keep-alive
```

*Bench*

```
Document Length:        0 bytes
Requests per second:    3540.91 [#/sec] (mean)
=======
HTTP/1.1 404 Not Found
Connection: keep-alive

```

*Document length*

```
Document Length:        0 bytes
```

*Trials*

```
Requests per second:    2393.21 [#/sec] (mean)
Requests per second:    2423.45 [#/sec] (mean)
Requests per second:    2429.17 [#/sec] (mean)
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
```

### Notes

<<<<<<< HEAD
+ Sets `Cache-Control` headers with or without a value
+ Part of a much larger framework
=======
+ Fastest module at serving `jquery.min.js` requests
+ Only of the tested modules that gzips
+ Document Length is 1 / 2.8 the size of other modules
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

## lightnode

*First commit* Feb 10, 2011

*Latest commit* Mar 07, 2011

[https://github.com/ngspinners/lightnode](https://github.com/ngspinners/lightnode)

```js
var lightnode = require('lightnode')
<<<<<<< HEAD
var files = new lightnode.FileServer('../../files')
=======
var files = new lightnode.FileServer('../files')
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

var http = require('http')
var server = new http.Server()

server.addListener('request', function(req, res) {
  return files.receiveRequest(req, res)
})

server.listen(8080)
```

<<<<<<< HEAD
### /jquery.min.js
=======
### 200 /jquery.min.js
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

*cURL headers*

```
<<<<<<< HEAD
HTTP/1.1 200 OK
last-modified: Sun, 10 Jun 2012 07:29:37 GMT
transfer-encoding: chunked
server: lightnode
Connection: keep-alive
```

*Bench*

```
Document Length:        94854 bytes
Requests per second:    2127.65 [#/sec] (mean)
```

### /santamonica.jpg

*cURL headers*

```
HTTP/1.1 200 OK
last-modified: Mon, 11 Jun 2012 12:33:46 GMT
transfer-encoding: chunked
server: lightnode
Connection: keep-alive
```

*Bench*

```
Document Length:        1051382 bytes
Requests per second:    1035.92 [#/sec] (mean)
```

### /asdf

*cURL headers*

```
HTTP/1.1 404 Not Found
server: lightnode
Connection: keep-alive
```

*Bench*

```
Document Length:        0 bytes
Requests per second:    4618.42 [#/sec] (mean)
=======
HTTP/1.1 200 OK
last-modified: Fri, 08 Jun 2012 10:22:35 GMT
transfer-encoding: chunked
server: lightnode
Connection: keep-alive

```

*Document length*

```
Document Length:        94854 bytes
```

*Trials*

```
Requests per second:    1531.07 [#/sec] (mean)
Requests per second:    1559.13 [#/sec] (mean)
Requests per second:    1557.25 [#/sec] (mean)
```

### 404 /

*cURL headers*

```
HTTP/1.1 404 Not Found
server: lightnode
Connection: keep-alive

```

```
Document Length:        0 bytes
```

*Trials*

```
Requests per second:    2241.32 [#/sec] (mean)
Requests per second:    2292.06 [#/sec] (mean)
Requests per second:    2266.78 [#/sec] (mean)
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
```

### Notes

<<<<<<< HEAD
+ Missing `Content-Type` headers
=======
+ Missing `Content-Type` header
+ Anomalous apache bench `Document Length` for `jquery.min.js` requests
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

## node-static

*First commit* Jul 26, 2010

*Latest commit* Aug 13, 2011

[https://github.com/cloudhead/node-static](https://github.com/cloudhead/node-static)

```js
var static = require('node-static')
<<<<<<< HEAD
var files = new static.Server('../../files')
=======
var files = new static.Server('../files')
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
  return files.serve(req, res)
})

server.listen(8080)

```

<<<<<<< HEAD
### /jquery.min.js
=======
### 200 /jquery.min.js
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

*cURL headers*

```
<<<<<<< HEAD
HTTP/1.1 200 OK
Cache-Control: max-age=3600
Server: node-static/0.5.9
Etag: "430854-94840-1339313377000"
Date: Mon, 11 Jun 2012 16:51:31 GMT
Last-Modified: Sun, 10 Jun 2012 07:29:37 GMT
Connection: keep-alive
```

*Bench*

```
Document Length:        94840 bytes
Requests per second:    2202.26 [#/sec] (mean)
```

### /santamonica.jpg

*cURL headers*

```
HTTP/1.1 200 OK
Cache-Control: max-age=3600
Server: node-static/0.5.9
Etag: "431202-1051367-1339418026000"
Date: Mon, 11 Jun 2012 16:51:40 GMT
Last-Modified: Mon, 11 Jun 2012 12:33:46 GMT
Connection: keep-alive
```

*Bench*

```
Document Length:        1051367 bytes
Requests per second:    1086.38 [#/sec] (mean)
```

### /asdf

*cURL headers*

```
HTTP/1.1 404 Not Found
Server: node-static/0.5.9
Connection: keep-alive
```

*Bench*

```
Document Length:        0 bytes
Requests per second:    3725.74 [#/sec] (mean)
=======
HTTP/1.1 200 OK
Server: node-static/0.5.9
Etag: "430854-94840-1339313377000"
Date: Sun, 10 Jun 2012 15:42:22 GMT
Last-Modified: Sun, 10 Jun 2012 07:29:37 GMT
Connection: keep-alive

```

*Document length*

```
Document Length:        94840 bytes
```

*Trials*

```
Requests per second:    1292.84 [#/sec] (mean)
Requests per second:    1296.69 [#/sec] (mean)
Requests per second:    1300.48 [#/sec] (mean)
```

### 404 /

*cURL headers*

```
HTTP/1.1 404 Not Found
Server: node-static/0.5.9
Connection: keep-alive

```

*Document length*

```
Document Length:        0 bytes
```

*Trials*

```
Requests per second:    1247.05 [#/sec] (mean)
Requests per second:    1260.23 [#/sec] (mean)
Requests per second:    1265.43 [#/sec] (mean)
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
```

### Notes

<<<<<<< HEAD
+ Insigificant req/s difference between `/jquery.min.js` and `/` requests, as node-static attempts to serve default files without breaking early if the path does not exist
=======
+ Insigificant difference between `200` and `404` tests, indicating that (a) files are cached in-memory and (b) node-static tries to serve default files without breaking early if the path does not exist. Indeed, after more testing, requesting `http://localhost:8080/asdf` is much faster than `http://localhost:8080/`, averaging in the upper 1800 requests per second.
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

## paperboy

*First commit* Jan 17, 2010

*Latest commit* Jun 04, 2012

[https://github.com/felixge/node-paperboy](https://github.com/felixge/node-paperboy)

```js
var paperboy = require('paperboy')

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
<<<<<<< HEAD
  paperboy.deliver('../../files', req, res)
=======
  paperboy.deliver('../files', req, res)
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
})

server.listen(8080);
```

<<<<<<< HEAD
### /jquery.min.js
=======
### 200 /jquery.min.js
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

*cURL headers*

```
<<<<<<< HEAD
HTTP/1.1 200 OK
Content-Type: text/javascript; charset=UTF-8
ETag: "430854-94840-1339313377000"
Last-Modified: Sun Jun 10 2012 00:29:37 GMT-0700 (PDT)
Content-Length: 94840
Connection: keep-alive
```

*Bench*

```
Document Length:        94840 bytes
Requests per second:    430.55 [#/sec] (mean)
```

### /santamonica.jpg

*cURL headers*

```
HTTP/1.1 200 OK
Content-Type: image/jpeg
ETag: "431202-1051367-1339418026000"
Last-Modified: Mon Jun 11 2012 05:33:46 GMT-0700 (PDT)
Content-Length: 1051367
Connection: keep-alive
```

*Bench*

```
Document Length:        1051367 bytes
Requests per second:    51.40 [#/sec] (mean)
```

### /asdf

*cURL headers*

```
HTTP/1.1 404 Not Found
Content-Type: text/html
Connection: keep-alive
```

*Bench*

```
Document Length:        32 bytes
Requests per second:    3501.75 [#/sec] (mean)
=======
HTTP/1.1 200 OK
Content-Type: text/javascript; charset=UTF-8
ETag: "430854-94840-1339313377000"
Last-Modified: Sun Jun 10 2012 00:29:37 GMT-0700 (PDT)
Content-Length: 94840
Connection: keep-alive

```

*Document length*

```
Document Length:        94840 bytes
```

*Trials*

```
Requests per second:    308.47 [#/sec] (mean)
Requests per second:    307.37 [#/sec] (mean)
Requests per second:    317.03 [#/sec] (mean)
```

### 404 /

*cURL headers*

```
HTTP/1.1 404 Not Found
Content-Type: text/html
Connection: keep-alive

```

*Document length*

```
Document Length:        32 bytes
```

*Trials*

```
Requests per second:    1738.96 [#/sec] (mean)
Requests per second:    1778.58 [#/sec] (mean)
Requests per second:    1721.78 [#/sec] (mean)
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
```

### Notes

<<<<<<< HEAD
+ Slowest of the tested modules
+ Wraps important functions in process.nexttick
=======
+ Slowest of the tested modules at serving `jquery.min.js` requests
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

## static-resource

*First commit* Aug 12, 2010

*Latest commit* Mar 16, 2012

[https://github.com/atsuya/static-resource](https://github.com/atsuya/static-resource)

```js
var fs = require('fs')
var resource = require('static-resource')
<<<<<<< HEAD
var handler = resource.createHandler(fs.realpathSync('../../files'))
=======
var handler = resource.createHandler(fs.realpathSync('../files'))
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
  if (!handler.handle(req.url, req, res)) {
    res.writeHead(404)
    return res.end()
  }
})

server.listen(8080)
```

<<<<<<< HEAD
### /jquery.min.js
=======
### 200 /jquery.min.js
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2

*cURL headers*

```
<<<<<<< HEAD
HTTP/1.1 200 OK
Content-Type: application/javascript
Connection: keep-alive
```

*Bench*

```
Document Length:        94840 bytes
Requests per second:    1708.44 [#/sec] (mean)

```

### /santamonica.jpg

*cURL headers*

```
HTTP/1.1 200 OK
Content-Type: image/jpeg
Connection: keep-alive
```

*Bench*

```
Document Length:        1051367 bytes
Requests per second:    377.39 [#/sec] (mean)

```

### /asdf

*cURL headers*

```
HTTP/1.1 404 Not Found
Connection: keep-alive
```

*Bench*

```
Document Length:        0 bytes
Requests per second:    4394.28 [#/sec] (mean)

=======
HTTP/1.1 200 OK
Content-Type: application/javascript
Connection: keep-alive

```

*Document length*

```
Document Length:        94840 bytes
```

*Trials*

```
Requests per second:    1276.35 [#/sec] (mean)
Requests per second:    1313.06 [#/sec] (mean)
Requests per second:    1312.83 [#/sec] (mean)
```

### 404 /

*cURL headers*

```
HTTP/1.1 404 Not Found
Connection: keep-alive

```

*Document length*

```
Document Length:        0 bytes
```

*Trials*

```
Requests per second:    2408.93 [#/sec] (mean)
Requests per second:    2381.30 [#/sec] (mean)
Requests per second:    2460.67 [#/sec] (mean)
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
```

### Notes

+ Sends files synchronously
<<<<<<< HEAD
+ Sets no headers for client-side expiration
=======
>>>>>>> e2ebd33ca436921fd1dd1413782ff7e48cc2f8a2
