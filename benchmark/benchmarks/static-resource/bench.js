
var fs = require('fs')
var resource = require('static-resource')
var handler = resource.createHandler(fs.realpathSync('../../files'))

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
  if (!handler.handle(req.url, req, res)) {
    res.writeHead(404)
    return res.end()
  }
})

server.listen(8080)
