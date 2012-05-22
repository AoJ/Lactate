# Lactate

Very simple static file server, with a few electives.

`npm install lactate`

## Example

Just pass three arguments to the serve function (`path`, `request`, `response`). Lactate will stream your file to the client in the most efficient way, by piping: readFile > gZip > response.

```js

var express = require('express')
var app = express.createServer()
var lactate = require('lactate')()

app.get('/', function(req, res) {
  reurn lactate.serve('pages/land.html', req, res)
})

app.get('/files/*', function(req, res) {
  return lactate.serve(req.url.substring(1), req, res)
})

app.get('/images/:img', function(req, res) {
  var img = req.params.img
  return lactate.serve('thumbs/'+img, req, res)
})

app.listen(8080)

```

##Options

Options can be passed to the initialization function or using the `set` method.

```js

//Passing to initialization function
var lactate = require('lactate')({expires:172800})

//Set method
lactate.set('expires', null)

//Either function accepts (key, value) or an object.

```

Available options are currently `cache` (boolean)  and `expires` (seconds).

The `cache` option will have Lactate save your files in memory. By default this is enabled, and there's no great reason to disable it.

Setting `expires` will have Lactase set appropriate `Expires` and `Cache-Control` headers for client-side caching. This option represents seconds-from-now to expire.

##TODO

+ Express middleware
+ Expiration defaults, e.g. 'two days,' 'one month'
+ Redis integration
+ Standalone server
