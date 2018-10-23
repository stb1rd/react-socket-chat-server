const port = 3001;
const lastMessageNum = 10;  // количество последних сообщений, отдаваемых клиенту после входа

const io = require('socket.io')();
var chatUsers = []; // логины
var chatMsg = [];   // сообщения

io.on('connection', (client) => {
  // список пользователей и архив последних n сообщений - отдаем клиенту
  const msgArchive = chatMsg.slice(chatMsg.length - lastMessageNum);
  client.emit ('setClientUserList', chatUsers);
  msgArchive.forEach(function(msg) {
    client.emit ('setClientMessageList', msg);
  });

  // добавление пользователя или сообщения: добавление в соотв. массив
  // и оповещение всех клиентов
  client.on ('addNewUser', function (user) {
    // списком пользователей, т.к. в теории, может изменяться (в будущем)
    chatUsers.push( user );
    io.emit ('setClientUserList', chatUsers);
  });

  client.on ('addNewMsg', function (msg) {
    // последним сообщением (т.к. реализовано только добавление)
    chatMsg.push( msg );
    io.emit ('setClientMessageList', chatMsg[chatMsg.length - 1]);
  });
});

io.listen(port);
console.log('listening on port ', port);