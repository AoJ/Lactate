
/*

  Four paths (p)
 
    Valid: testimages/script.js
    Valid: testimages/style.css
    Invalid: testimages/somn.tiff
    Invalid: empty string
 
  Three option sets (o)
 
    1 No options enabled
    2 With in-memory caching of files
    3 With in-memory & client-side caching
 
  To test caching, pertaining
  tests are executed twice (n)
 
  (n * o * p) - n = 20 total tests

  Test parameters include
    
    * Status code
    * Content-Type
    * Content-Encoding
    * Content-Length
    * In-memory cache
    * Expires headers
  
*/


var http = require('http')
var request = require('request')

var lactate = require('../lib/lactate')()

lactate.set('cache', false)

var randomPort = ~~(Math.random() * 100) + 9000
var base = 'http://localhost:'+randomPort+'/'

var server = http.createServer(function(req, res) {
  return lactate.serve(req.url.substring(1), req, res)
})

var resKeys = [
 'No options',
 'In-memory caching',
 'In-memory + client-side'
]

var tests = {
  'testfiles/script.js': {
    expect: {
      status:200,
      type:'application/javascript',
      encoding:'gzip',
      length:59
    }
  },
  'testfiles/style.css': {
    expect: {
      status:200,
      type:'text/css',
      encoding:'gzip',
      length:49
    }
  },
  'testfiles/somn.tiff': {
    expect: {
      status:404
    }
  },
  '': {
    expect:{
      status:404
    }
  }
}

var expiresHeaders = [
  'expires',
  'cache-control',
  'last-modified'
]

var validExpires = function(headers) {
 return expiresHeaders.every(function(i) {
    return headers.hasOwnProperty(i)
 })
}

/* Hook into debug output */
var lastEvent = ''
lactate.set('debug', function(a,b) {
  lastEvent = b
})

var completedTestCount = 0
var completedTests = {}

var log = function(v) {
  var args = Array.prototype.slice.call(arguments, 1)
  args[0] = (v ? '\u001b[32m' : '\u001b[31m') + args[0]
  args.push('\u001b[0m')
  return console.log.apply(this, args)
}

var testPaths = function(fn) {

  var keys = Object.keys(tests)

  ;(function next(n, o, p) {

    var item     = keys[n]
    var test     = tests[item]
    var url      = base + item
    var expect   = test.expect
    var name     = resKeys[o]
    var testId   = [n, o, p].join(':')

    function tryPass(val, ifFail) {

      if (val) {
        var prev = completedTests[testId]
        if (!prev) {
          completedTests[testId] = true
          log(val, 'Passed')
        }
      }else {
        log(val, 'Failed:', ifFail)
      }
      
    }

    request(url, function(e, r, b) {

      if (!e && r) {

        console.log('Testing:', testId, '[', name, ']', item||'empty string')

        if (expect.length) {
          tryPass(expect.length === b.length, 'Improper content length')
        }

        var status = r.statusCode

        tryPass(status === expect.status, 'Incorrect status')

        if (expect.status === 200) {

          var headers  = r.headers
          var type     = headers['content-type']
          var encoding = headers['content-encoding']

          tryPass(encoding === expect.encoding, 'Incorrect content-encoding')
          tryPass(type === expect.type, 'Incorrect type')

          if (o > 0 && p == 1) {
            /* In-memory caching */
            tryPass(/Cached in memory/.test(lastEvent), 'Failed to cache file in-memory')
          }

          if (o === 2) {
            /* Client-side caching */
            tryPass(validExpires(headers), 'Failed to se proper expires headers')
          }

        }

      }else {
        throw new Error([
          'Failed:',
          resKeys[o],
          item,
          status
        ].join(' '))
        process.exit(1)
      }

      ++completedTestCount

      if ((o > 0 && p === 1) || o === 0) {
        if (n === keys.length-1) {
          if (o === 0) {
            lactate.set('cache', true)
          }else if (o === 1) {
            lactate.set('expires', 172800)
          }else if (o === 2) {
            return finished()
            return process.exit(0)
          }
          return next(0, ++o, 0)
        }else {
          return next(++n, o, 0)
        }
      }else {
        return next(n, o, ++p)
      }

    })

  })(0, 0, 0)
}

var finished = function() {
  var passed = Object.keys(completedTests).length
  console.log('Completed', completedTestCount, 'tests')
  console.log([passed, '/', completedTestCount, ' tests pass'].join(''))
  process.exit(0)
}

server.listen(randomPort, function() {
  testPaths()
})
