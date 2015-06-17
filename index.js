var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

clients = []

io.on('connect', function(socket){
  socket.emit('join chat');

  socket.on('enter username', function(username){
    io.emit('room message', username + ' connected');
    client = {
      id: socket.id,
      username: username
    };
    clients.push(client);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    client = clients.filter(function(client){
      return client.id == socket.id;
    })[0];
    clientIndex = clients.indexOf(client);
    io.emit('room message', client.username + ' disconnected');
    clients.splice(clientIndex, 1);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

