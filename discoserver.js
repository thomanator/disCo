var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var WELL = require('well-rng')
var rng = new WELL();

var hexVal,keyVal;
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/kbase';

var range = 50;

app.get('/',function(req,res)
{
res.sendfile('discoclient.html');
})


io.on('connection',function(socket){
var rand = rng.randInt(0,1000);
io.emit('random',rand);
socket.on('hexval',function(msg,db)
{
hexVal = msg;
console.log('key-value: '+rand+'Hexa-value '+hexVal);
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    
    var hexval = db.collection('hexval');
    var cursor = hexval.find({key:rand});
    cursor.each(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        if(doc==null)
        {
           hexval.insert({key:rand,hexvalue:hexVal});
        }
      }
    });
  
   
    
  }
});
});

});

http.listen(3000);

console.log('listening on 3000');