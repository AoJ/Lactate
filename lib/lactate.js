
var fs = require('fs')
var zlib = require('zlib')
var mime = require('mime')
var path = require('path')

var Suckle = require('suckle')

var opts = {
  cache:true,
  expires:0,
  root:process.cwd(),
  debug:false
}

function debug() {
  var dbg = opts.debug
  if (dbg) {
    var func = console.log
    if (typeof dbg === 'function') func = dbg
    return func.apply(this, arguments)
  }
}

var cache = {}

var readAndSend = function(path, rObj, res) {
  var gz = zlib.createGzip()
  var rs = fs.createReadStream(path)

  rs.on('open', function(fd) {
    res.writeHead(200, rObj)
  })

  if (opts.cache) {
    var mux = new Suckle(true, res)
    mux.oncomplete(function(data) {
        cache[path] = {
            data:data,
            rObj:rObj
        }
    })
    gz.pipe(mux)
  }else {
    gz.pipe(res)
  }
  rs.pipe(gz)
}

var serveFile = function(fp, req, res) {

  var filePath = opts.root + '/' + (fp||'')
  var exists = path.existsSync(filePath)

  debug(0, 'Serving file', filePath, fp)

  if (!exists || !fp) {
    debug(1, 'Does not exist', 404)
    res.writeHead(404)
    return res.end()
  }

  var stat = fs.statSync(filePath)
  var mtime = stat.mtime.toUTCString()

  var ims = req.headers['if-modified-since']

  var parsedIMS = 0
  var parsedMTime = 0

  if (ims) {
    parsedIMS = Date.parse(ims)
    parsedMTime = Date.parse(mtime)
    if (opts.expires&&parsedIMS===parsedMTime) {
      debug(1, 'Client has file cached', 304)
      res.writeHead(304)
      return res.end()
    }
  }

  if (opts.cache) {
    var cached = cache[filePath]
    if (cached) {
      var lm = cached.rObj['Last-modified']
      if (!lm || lm === parsedMTime) {
        debug(1, 'Cached in memory', filePath, 200)
        res.writeHead(200, cached.rObj)
        return res.end(cached.data)
      }
    }
  }

  var mimeType = mime.lookup(filePath)
  var date = new Date()

  var rObj = { 
    'Content-Type':mimeType,
    'Content-Encoding':'gzip'
  }

  if (opts.expires) {
    date.setHours(date.getHours() + (opts.expires/3600))
    rObj['Last-Modified'] = mtime
    rObj['Expires'] = date.toUTCString()
    rObj['Cache-Control'] = 'max-age='+opts.expires
  }

  return readAndSend(filePath, rObj, res)
}

var makeDebugger = function() {

  var level, fn

  var arg1 = arguments[1]
  var arg2 = arguments[2]

  var type = function(a, b) {
    return typeof a === b
  }

  if (type(arg1, 'number')) level = arg1
  else arg2 = arg1

  if (type(arg2, 'function')) fn = arg2

  var lt = type(level, 'number')

  var result = function() {
    if ((lt && arguments[0] === level) || !lt) {
      var func = console.log
      var dbg = fn || opts.debug
      if (type(dbg, 'function')) func = dbg
      return func.apply(this, arguments)
    }
  }

  return result
}

var setOption = function(k, v) {

  var isString = typeof(k) === 'string'

  if (isString) k = k.toLowerCase();

  var hasProp = opts.hasOwnProperty.bind(opts)

  if (k === 'debug' && typeof v !== 'boolean') {
    v = makeDebugger.apply(this, arguments)
  }

  if (isString && hasProp(k)) {
    opts[k] = v
    cache = {}
  }else {
    for (opt in k) {
      setOption(opt, k[opt])
    }
  }

}

var getOption = function(k) {
  var isString = typeof(k) === 'string'
  if (!isString) return new Error('First argument must be a string')
    var val = opts[k.toLowerCase()]
  if (val) return val
  else return new Error('No such option "'+k+'"')
}

module.exports = function(options) {

  if (options) setOptions(options)

    return {
      serve:serveFile,
      set:setOption,
      get:getOption
    }

}
