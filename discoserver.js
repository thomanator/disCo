var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var WELL = require('well-rng')
var rng = new WELL();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/kbase';

app.get('/',function(req,res) {      //for routing to discoclient.html
  res.sendfile('discoclient1.html');
})

io.on('connection',function(socket) {
  socket.on('blah',function(msg){
    console.log(msg.a+','+msg.b);
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      }
      else {
        var hexval = db.collection('new');
        var cursor = hexval.find({key:msg.a});
        cursor.each(function (err, doc) {
          if (err) {
            console.log(err);
          } 
          else {
            if (doc==null) {
            hexval.insert({key:msg.a,hexvalue:msg.b});  //inserting value only if the value for the key does not exist
            }
          }
        });
      }
    });
  });
});
http.listen(3000);
console.log('listening on 3000')