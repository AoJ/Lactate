
var fs = require('fs')
var zlib = require('zlib')
var mime = require('mime')
var path = require('path')

var opts = {cache:false, expires:0}
var cache = {}

var readAndSend = function(path, res, rObj) {
  var gz = zlib.createGzip()
  var rs = fs.createReadStream(path)

  rs.on('open', function(fd) {
    res.writeHead(200, rObj)
  })

  gz.pipe(res)
  var zipped = rs.pipe(gz)

  if (opts.cache) {
    zipped.on('end', function(d) {
      cache[path] = {
        rObj:rObj,
        data:zipped._buffer
      }
    })
  }
}

var serveFile = function(filePath, req, res) {

  var exists = path.existsSync(filePath)

  if (!exists ) {
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
      res.writeHead(304)
      return res.end()
    }
  }

  if (opts.cache) {
    var cached = cache[filePath]
    if (cached) {
      var lm = cached.rObj['Last-modified']
      if (lm === parsedMTime) {
        res.writeHead(200, cached.rObj)
        return res.end(cached.data)
      }
    }
  }

  var mimeType = mime.lookup(filePath)
  var date = new Date()

  var rObj = { 
    'Content-Type':mimeType,
    'Content-Encoding':'gzip',
    'Date':date.toUTCString(),
    'Last-Modified':mtime
  }

  if (opts.expires) {
    date.setHours(date.getHours() + (opts.expires/3600))
    rObj['Expires'] = date.toUTCString()
    rObj['Cache-Control'] = 'max-age='+opts.expires
  }

  return readAndSend(filePath, res, rObj)
}

var setOptions = function(k, v) {
  
  var isString = typeof(k) === 'string'

  var hasProp = opts.hasOwnProperty.bind(opts)

  if (isString && hasProp(k)) {
    opts[k] = v
  }else {
    for (opt in k) {
      if (hasProp(opt)) {
        opts[opt] = k[opt]
      }
    }
  }
}

module.exports = function(options) {

  if (options) setOptions(options)

  return {
    serve:serveFile,
    set:setOptions
  }

}
