
var bastard = require('bastard')
var Bastard = bastard.Bastard

var bastardObj = new Bastard({
  base:'../../files',
  fingerprintURLPrefix:'/f/',
  urlPrefix:'/',
  rawURLPrefix:'/raw/'
})

var http = require('http')
var server = new http.Server

server.addListener('request', function(req, res) {
  bastardObj.possiblyHandleRequest(req, res)
})

server.listen(8080)
