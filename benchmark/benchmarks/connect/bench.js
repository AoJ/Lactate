
var connect = require('connect')
var files = connect.static('../../files')

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
 files(req, res, function() {
    res.writeHead(404)
    res.end()
 })
})

server.listen(8080)
