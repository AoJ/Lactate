# Nodejs static file handler benchmark comparison

Implementations were standard; potential optimizations exist for the various modules.

`cURL headers` were discovered using

```
curl -I
```

`Trials` results come from three runs of 

```
ab -n 10000
```

Without server restarts in-between trials

## bastard

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
})

server.listen(8080)
```

### 200 /jquery.min.js

*cURL headers*

```
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
```

### Notes

+ Passing in the "[default configuration](https://github.com/unprolix/bastard#configuration)" to `new Bastard()` was necessary
+ Content-Length for cURL was `0 bytes` for valid `jquery.min.js` requests

## connect

[http://www.senchalabs.org/connect/static.html](http://www.senchalabs.org/connect/static.html)

```js
var connect = require('connect')
var files = connect.static('../files')

var http = require('http')
var server = new http.Server

server.addListener('request', files)

server.listen(8080)
```

### 200 /jquery.min.js

*cURL headers*

```
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
+ Setting maxAge on options object insignificantly decreased performance

## lactate

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
Requests per second:    2393.21 [#/sec] (mean)
Requests per second:    2423.45 [#/sec] (mean)
Requests per second:    2429.17 [#/sec] (mean)
```

## lightnode

```js
var lightnode = require('lightnode')
var files = new lightnode.FileServer('../files')

var http = require('http')
var server = new http.Server()

server.addListener('request', function(req, res) {
  return files.receiveRequest(req, res)
})

server.listen(8080)
```

### 200 /jquery.min.js

*cURL headers*

```
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
```

## node-static

```js
var static = require('node-static')
var files = new static.Server('../files', {cache:360000})

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
  return files.serve(req, res)
})

server.listen(8080)

```

### 200 /jquery.min.js

*cURL headers*

```
HTTP/1.1 200 OK
Cache-Control: max-age=360000
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
```

## paperboy

```js
var paperboy = require('paperboy')

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
  paperboy.deliver('../files', req, res)
})

server.listen(8080);
```

### 200 /jquery.min.js

*cURL headers*

```
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
```

## static-resource

```js
var fs = require('fs')
var resource = require('static-resource')
var handler = resource.createHandler(fs.realpathSync('../files'))

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

### 200 /jquery.min.js

*cURL headers*

```
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
```
