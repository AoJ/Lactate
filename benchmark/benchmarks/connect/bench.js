
var connect = require('connect')
var files = connect.static('../files')

var http = require('http')
var server = new http.Server

server.addListener('request', files)

server.listen(8080)
