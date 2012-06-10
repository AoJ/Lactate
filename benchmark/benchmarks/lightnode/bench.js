var lightnode = require('lightnode')
var files = new lightnode.FileServer('../files')

var http = require('http')
var server = new http.Server()

server.addListener('request', function(req, res) {
  return files.receiveRequest(req, res)
})

server.listen(8080)


