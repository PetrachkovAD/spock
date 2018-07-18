var game = require('./game');

var Game = new game();

module.exports = function(server) {
  var io = require('socket.io')(server);

  io.on('connection', function(socket){
    socket.on('subscribe', function() {
      console.log('Create room %s', socket.id);
      // socket.room = socket.id;
      // socket.username = socket.id;
      socket.emit('subscribe', socket.id);
    });

    socket.on('joinTo', function(id) {
      var gameId = id + socket.id;

      Game.start(id, socket.id);
      // Подключем к игрока в отдельную комнату её ID будет ID игры
      // Сами комнаты это стандартная плюшка socket.io
      socket.join(gameId);
      // Подключим к комнате(игре) нашего соперника обратившись к нему через вебсокеты
      if(io.sockets.sockets[id]) {
        io.sockets.sockets[id].join(gameId);
      }
      

      console.log('Create game %s', gameId);
      // socket.room = id;
      // socket.username = socket.id;

      io.sockets.in(gameId).emit('linked', gameId);
    });

    socket.on('step', function(gameId, value) {
      Game.step(gameId, socket.id, value, function(result) {
          // Если игра завершена
          if(result) {
            console.log('results:');
            console.log(result);
            io.sockets.in(gameId).emit('roundResult', result);
            // Начинаем новую игру, с теми же участниками
            Game.clear(gameId);
          }
      });
    });

    socket.on('disconnect', function() {
      console.log('disconnect %s', socket.id);
      // Если один из игроков отключился, посылаем об этом сообщение второму
      // Отключаем обоих от игры и удаляем её, освобождаем память
      Game.end(socket.id, function(gameId, opponent) {
        if(io.sockets.sockets[opponent]) {
          // Посылаем сопернику что игрок отключён, причём наша функция Game.end возвращает независимо от того кто прервал игру, ID соперника
          io.sockets.sockets[opponent].emit('exit');
          // Отключаем соперника из комнаты
          io.sockets.sockets[opponent].leave(gameId);
        }
        // Отключаем пользователя из комнаты
        socket.leave(gameId);
      });
    });

    socket.on('message', function(text, callback) {
      // socket.broadcast.emit('message', text);
      // callback();
      io.sockets.in(socket.room).emit('message', socket.username, data);
    });
  });
}
