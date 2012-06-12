
var lactate = require('lactate')
var files = lactate.dir('../../files')

var http = require('http')
var server = new http.Server()

server.addListener('request', function(req, res) {
    return files.serve(req, res) 
})

server.listen(8080)



