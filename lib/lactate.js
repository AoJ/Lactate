
var fs        = require('fs')
,   path      = require('path')
,   zlib      = require('zlib')
,   mime      = require('mime')
,   Suckle    = require('suckle')
,   expire    = require('expire')
,   makeDebug = require('./debugger.js')

function Lactate(options) { 

    this.opts = {
          cache:    {}
        , expires:  0
        , root:     process.cwd()
        , public:   ''
        , debug:    false
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
        ,   rs = fs.createReadStream(path)

        rs.on('open', function(fd) {
            self._200('Read and served file', res, rObj)

            if (self.opts.cache) {

                var mux = new Suckle(res, function(data) {
                    self.setCache(path, data, rObj)
                })

                gz.pipe(mux)
            }else {
                gz.pipe(res)
            }

            rs.pipe(gz)
        })

        rs.on('error', function(){
            return self._404(res)
        })

    },

    serve:function(fp, req, res) {

        var opts     = this.opts
        ,   filePath = opts.root
        ,   public   = opts.public
        ,   self     = this
        ,   stat

        if (typeof(fp) === 'string') {
            filePath = path.join(filePath, fp)
        }else {
            res = req
            req = fp

            var url = req.url
            ,   dirname = path.dirname(url).substring(1)

            if (public && dirname !== public) {
                return self._404(res)
            }

            var len = public.length + 1

            filePath = path.join(filePath, url.substring(len))

        }

        this.debug(0, 'Serving file', filePath)

        try {
            stat = fs.statSync(filePath)
        }catch(exception) {
            return self._404(res)
        }

        if (!stat.isFile()) {
            return self._404(res)
        }

        var mtime       = stat.mtime.toUTCString()
        ,   ims         = req.headers['if-modified-since']
        ,   parsedIMS   = 0
        ,   parsedMTime = 0

        if (ims) {

            parsedIMS = Date.parse(ims)
            parsedMTime = Date.parse(mtime)

            if (opts.expires && parsedIMS===parsedMTime) {
                return this._304(res)
            }
        }

        if (!opts.cache) {
            return this.complete(filePath, mtime, res)
        }

        this.getCache(filePath, function(err, cached) {

            if (err || !cached) {
                return self.complete(filePath, mtime, res)
            }

            var lm = cached.rObj['Last-modified']

            if (!lm || lm === parsedMTime) {
                self._200('Cached in memory', res, cached.rObj, cached.data)
            }
        })

    },

    _200:function(msg, res, headers, data) {
        var status = 200
        this.debug(1, msg, status)
        res.writeHead(status, headers)
        if (data) return res.end(data)
    },

    _304:function(res) {
        this.debug(1, 'Client has file cached', 304)
        res.writeHead(304)
        return res.end()
    }, 

    _404:function(res) {
        this.debug(1, 'Does not exist', 404)
        res.writeHead(404)
        return res.end()
    },

    complete:function(filePath, mtime, res) {

        var mimeType = mime.lookup(filePath)
        var date     = new Date()

        var rObj = { 
            'Content-Type':      mimeType,
            'Content-Encoding':  'gzip',
            'Last-Modified':     mtime
        }

        var expires = this.opts.expires

        if (expires) {
            expire.setExpiration(rObj, expires)
        }

        return this.send(filePath, rObj, res)

    },

    set:function(k, v) {

        var opts        = this.opts
        ,   keyIsString = typeof(k) === 'string'
        ,   valType     = typeof(v)

        if (keyIsString) k = k.toLowerCase();

        var hasProp = function(prop) {
          return opts.hasOwnProperty(prop)
        }

        if (k === 'debug' && valType !== 'boolean') {
            v = makeDebug.apply(this, arguments)
        }else if (k === 'cache' && v === true) {
            v = {}
        }else if (valType === 'string') {
            if (k === 'expires') {
                v = expire.getSeconds(v)
            }else if (k === 'root' || k === 'public') {
                v = path.normalize(v)
            }
        }

        if (keyIsString && hasProp(k)) {
            opts[k]    = v
            opts.cache = {} //Reset cache
        }else if (typeof(k) === 'object') {
            for (var opt in k) {
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

    lactate.toMiddleware = function(_o) {

        if (_o) {
          lactate.set.apply(lactate, arguments)
        }

        var public = lactate.get('public')

        return function(req, res, next) {

            var url = req.url
            ,   basename = path.dirname(url).substring(1)

            if (basename === public) {
                return lactate.serve(path.basename(url), req, res)
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
