var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

clients = []

findEmittingClient = function(socketID, clients) {
  client = clients.filter(function(client){
    return client.id == socketID;
  })[0];
  return client;
}

io.on('connect', function(socket){
  socket.emit('join chat');

  socket.on('enter username', function(username){
    client = {
      id: socket.id,
      username: username
    };
    clients.push(client);
    io.emit('room message', username + ' connected');
    io.emit('update room members', clients);
  });

  socket.on('chat message', function(msg){
    client = findEmittingClient(socket.id, clients);
    io.emit('chat message', client, msg);
  });

  socket.on('disconnect', function(){
    client = findEmittingClient(socket.id, clients);
    clientIndex = clients.indexOf(client);
    clients.splice(clientIndex, 1);
    io.emit('room message', client.username + ' disconnected');
    io.emit('update room members', clients);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

