
var fs     = require('fs')
var zlib   = require('zlib')
var mime   = require('mime')
var path   = require('path')

var Suckle = require('suckle')
var expire = require('expiration_date')

var makeDebugger = require('./debugger')

function Lactate(options) { 

    this.opts = {
          cache:{}
        , expires:0
        , root:process.cwd()
        , debug:false
    }

    if (options) {
        this.set(options)
    }

}

Lactate.prototype = {

    debug:function() {

        var dbg = this.opts.debug
        if (dbg) {
            var func = console.log
            if (typeof dbg === 'function') func = dbg
            return func.apply(this, arguments)
        }

    },

    getCache:function(path, fn) {

        /*
         * To easily drop-in 
         * external caching ability
         * in the future
         */

        return fn(null, this.opts.cache[path])

    },

    setCache:function(path, data, rObj) {

        this.opts.cache[path] = {
            data:data,
            rObj:rObj
        }

    },

    send:function(path, rObj, res) {

        var self = this

        var gz = zlib.createGzip()
        var rs = fs.createReadStream(path)

        rs.on('open', function(fd) {
            res.writeHead(200, rObj)
        })

        if (this.opts.cache) {

            var mux = new Suckle(res, function(data) {

                self.debug(1, 'Read and served file', 200)
                self.setCache(path, data, rObj)

            })

            gz.pipe(mux)
        }else {
            gz.pipe(res)
        }

        rs.pipe(gz)

    },

    serve:function(fp, req, res) {

        var self = this

        var filePath = this.opts.root + '/' + (fp||'')
        var exists = path.existsSync(filePath)

        this.debug(0, 'Serving file', filePath)

        if (!exists || !fp) {
            this.debug(1, 'Does not exist', 404)
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
            if (this.opts.expires
            &&parsedIMS===parsedMTime) {
                this.debug(1, 'Client has file cached', 304)
                res.writeHead(304)
                return res.end()
            }
        }

        if (!this.opts.cache) {
            return this.complete(filePath, mtime, res)
        }

        this.getCache(filePath, function(err, cached) {

            if (err || !cached) {
                return self.complete(filePath, mtime, res)
            }

            var lm = cached.rObj['Last-modified']

            if (!lm || lm === parsedMTime) {
                self.debug(1, 'Cached in memory', filePath, 200)
                res.writeHead(200, cached.rObj)
                return res.end(cached.data)
            }
        })

    },

    complete:function(filePath, mtime, res) {

        var mimeType = mime.lookup(filePath)
        var date = new Date()

        var rObj = { 
            'Content-Type':mimeType,
            'Content-Encoding':'gzip'
        }

        var expires = this.opts.expires

        if (expires) {
            rObj['Last-Modified'] = mtime
            expire.setExpiration(rObj, expires)
        }

        return this.send(filePath, rObj, res)

    },

    set:function(k, v) {

        var opts = this.opts
        var isString = typeof(k) === 'string'

        if (isString) k = k.toLowerCase();

        var hasProp = opts.hasOwnProperty.bind(opts)

        if (k === 'debug' && typeof v !== 'boolean') {
            v = makeDebugger.apply(this, arguments)
        }else if (k === 'expires' && typeof v === 'string') {
            v = expire.getSeconds(v)
        }else if (k === 'cache' && v === true) {
            v = {}
        }

        if (isString && hasProp(k)) {
            opts[k] = v
            opts.cache = {}
        }else {
            for (opt in k) {
                this.set(opt, k[opt])
            }
        }

    },

    get:function(k) {

        if (typeof(k) !== 'string') {
            return new Error('First argument must be a string')
        }

        var val = this.opts[k.toLowerCase()]

        if (typeof(val) === 'undefined') {
            return new Error('No such option "'+k+'"')
        }

        return val

    }
}

function file(path, req, res, options) {
    options = typeof(options) === 'object' ? options : {}
    var lactate = new Lactate(options)
    return lactate.serve(path, req, res)
}

function dir(directory, options) {
    options = typeof(options) === 'object' ? options : {}
    options.root = directory
    var lactate = new Lactate(options)

    lactate.toMiddleware = function() {
        var len = directory.length + 1
        return function(req, res, next) {

            var url = req.url
            var sub = url.substring(1, len)

            if (sub === directory) {
                return lactate.serve(url.substring(len + 1), req, res)
            }else {
                return next()
            }
        }
    }

    return lactate
}

module.exports.Lactate = function(options) {
    return new Lactate(options)
}

module.exports.file = file
module.exports.dir = dir
