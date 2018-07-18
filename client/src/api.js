import openSocket from 'socket.io-client';
const socket = openSocket('0.0.0.0:8080');
// TODO добавить обрабочики ошибок

function subscribe(getConnectionId, getGameId, getGameResult, disconnect) {
	// Получаем ссылку для связи
	socket.on('subscribe', id => getConnectionId(id));
	// Получаем ссылку на игру
	socket.on('linked', gameId => getGameId(gameId))
	// Получаем результат игры
	socket.on('roundResult', res => getGameResult(res) );
	// Обработываем разрыв связи
	socket.on('exit', () => disconnect());

	socket.emit('subscribe');
}

function joinTo(id) {
	// Устанавливаем связь
	socket.emit('joinTo', id);
}

function step(gameId, value) {
	socket.emit('step', gameId, value);
}

export { subscribe, joinTo, step };