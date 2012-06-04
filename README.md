# Lactate

Very simple static file handler, with a few electives.

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

Available options are currently `cache` (boolean), `expires` (seconds), `root` (string), and `debug`.

The `cache` option will have Lactate save your files in memory. By default this is enabled, and there's no great reason to disable it.

Setting `expires` will have Lactase set appropriate `Expires` and `Cache-Control` headers for client-side caching. This option represents seconds-from-now to expire.

Lactate comes with expiration defaults, such as "one day." All of the following should work.

```code
lactate.set('expires', 87500)
//87500 seconds
lactate.set('expires', 'two days')
//172800 seconds
lactate.set'expires', 'five weeks and one minute and ten seconds')
//3024070 seconds
```

The `root` option will change the root directory from which to serve files. By default, the root is the current working directory.

### Debugging

Debugging is level-based. The `debug` function accepts a number and a callback function, or a boolean. By default, the debugging function is console.log. The following syntaxes are valid.

```js

var lactate = require('lactate')({
  debug:true
})

lactate.set('debug', 0, function(level, msg, path, statusCode) {
  /* 
    Do stuff

    Note however that statusCode arguments are only
    given for level 0 listeners
  */
})

lactate.set('debug', 1, console.log)
lactate.set({debug:false})

```

More robust debugging will come in the future as I isolate the functionality into a module of its own.

##TODO

+ Express middleware
+ Expiration defaults, e.g. 'two days,' 'one month'
+ Redis integration
+ Standalone server
