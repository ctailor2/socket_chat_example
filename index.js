var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var models = require("./models");

models.sequelize.sync();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connect', function(socket){
  socket.emit('join chat');

  socket.on('enter username', function(username){
    models.User.create({
      socket_identifier: socket.id,
      username: username
    }).then(function(user){
      io.emit('room message', user.username + ' connected');
      models.User.findAll().then(function(users){
        io.emit('update room members', users);
      });
    })
  });

  socket.on('chat message', function(msg){
    models.User.findOne({
      where: {
        socket_identifier: socket.id
      }
    }).then(function(user){
      io.emit('chat message', user, msg);
    })
  });

  socket.on('disconnect', function(){
    models.User.findOne({
      where: {
        socket_identifier: socket.id
      }
    }).then(function(user){
      user.destroy();
      io.emit('room message', user.username + ' disconnected');
      models.User.findAll().then(function(users){
        io.emit('update room members', users);
      });
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

