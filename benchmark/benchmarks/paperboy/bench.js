var paperboy = require('paperboy')

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
  paperboy.deliver('../../files', req, res)
})

server.listen(8080);
