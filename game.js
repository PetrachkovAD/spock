var TicTacToe = module.exports = function() {
    // Массив id игры = объект игры
    this.games = [];
    // Массив подключённых пользователей = id игры
    this.users = [];
}

TicTacToe.prototype.start = function(user, opponent) {
    // Создаём игру между этими игроками
    var game = new GameItem(user, opponent);
    // Создаём уникальный ID игры из ID игроков
    var id = user + opponent;
    // Добавляем игру в список действующих
    this.games[id] = game;
    // Добавляем игрока в общей список играющих
    this.users[user] = id;
    // Добавляем его соперника так же
    this.users[opponent] = id;
}

TicTacToe.prototype.end = function(user, cb) {
    // Если пользователь уже был удалён выходим, значит игры уже нет
    if(this.users[user] === undefined) return;
    // Получаем ID игры в которой находится пользователь
    var gameId = this.users[user];
    // Если игра уже была удалена, выходим
    if(this.games[gameId] === undefined) return;
    // Получаем объект игры по его ID
    var game = this.games[gameId];
    // Получаем соперника из этой игры
    var opponent = (user == game.user ? game.opponent : game.user);
    // Удаляем объект игры
    delete this.games[gameId];
    // Освобождаем память
    game = null;
    // Удаляем пользователя из списка
    delete this.users[user];
    // Возвращаем ID игры и ID соперника в этой игре
    cb(gameId, opponent);
}

TicTacToe.prototype.step = function(gameId, user, value, cb) {
    // Данная функция служит как proxy для обращения к нужной игре из коллекции и передачи параметров в неё
    if(this.games[gameId]) {
      this.games[gameId].step(user, value, cb);
    }
}

TicTacToe.prototype.clear = function(gameId, user, cb) {
    // Данная функция служит как proxy для обращения к нужной игре из коллекции
    this.games[gameId].clear();
}

function GameItem(user) {
  this.field={}
}
// Расчет победителя
GameItem.prototype.compare = function(value, value2) {
  // Преобразуем в зависимости "Кто кого бьет"
  const RULES = {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['paper', 'spock'],
    spock: ['rock', 'scissors']
  }
  // Если у value есть value2 то он победил
  return RULES[value].indexOf(value2) != -1;
}
// Приходят ходы от пользователей,
// если это ход последнего пользователя расчитывается победитель.
GameItem.prototype.step = function(id, value, callback) {
  // Храним первый выбор игрока, по его id 
  if(!this.field[id]) {
    this.field[id] = value;
  }

  var ids = Object.keys(this.field);

  //Если есть ходы обоих игроков можно определить победителя
  if(ids.length == 2) {
    var stepFirstPlayer = this.field[ids[0]],
      stepSecondPlayer = this.field[ids[1]];

    this.field[ids[0]] = {
      isWin: this.compare(stepFirstPlayer, stepSecondPlayer),
      enemyStep: stepSecondPlayer
    }
    this.field[ids[1]] = {
      isWin: !this.field[ids[0]].isWin,
      enemyStep: stepFirstPlayer
    }

    // Результат матча будет получен в виде
    // isWin (true/false) - победил игрок или нет
    // enemyStep - ход противника
    callback(this.field);
  }
  else {
    // Матч не завершен
    callback(false);
  }
}

GameItem.prototype.clear = function() {
	this.field = {};
}