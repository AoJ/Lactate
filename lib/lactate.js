
var fs     = require('fs')
var zlib   = require('zlib')
var mime   = require('mime')
var path   = require('path')

var Suckle = require('suckle')

var getSeconds   = require('./expiration_defaults')
var makeDebugger = require('./debugger')

var cache  = {}

function Lactate(options) { 

    this.opts = {
          cache:true
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


    },
    
    serve:function(fp, req, res) {

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

        if (this.opts.cache) {
            var cached = cache[filePath]
            if (cached) {
                var lm = cached.rObj['Last-modified']
                if (!lm || lm === parsedMTime) {
                    this.debug(1, 'Cached in memory', filePath, 200)
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

        var expires = this.opts.expires

        if (expires) {
            date.setHours(date.getHours() + (expires/3600))
            rObj['Last-Modified'] = mtime
            rObj['Expires'] = date.toUTCString()
            rObj['Cache-Control'] = 'max-age='+expires
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
            v = getSeconds(v)
        }

        if (isString && hasProp(k)) {
            opts[k] = v
            cache = {}
        }else {
            for (opt in k) {
                this.set(opt, k[opt])
            }
        }


    },
    
    get:function() {

        var isString = typeof(k) === 'string'
        if (!isString) {
            return new Error('First argument must be a string')
        }

        var val = this.opts[k.toLowerCase()]
        if (typeof val !== 'undefined') return val
        else return new Error('No such option "'+k+'"')
    }
}

module.exports = function(options) {
    return new Lactate(options)
}
