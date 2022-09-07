const BAD_REQUEST = 400; // некорректный запрос данных
const UNAUTHORIZED = 401; // попытка несанкционированного доступа
const NOT_FOUND = 404; // искомые данные не найдены
const INTERNAL_SERVER_ERROR = 500; // внутренныя ошибка сервера

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
};

// Вообще можно установить библиотеку http-status-codes
// командой npm install http-status-codes --save
// и вытаскивать оттуда статусы по инструкции, описанной по адресу
// https://github.com/prettymuchbryce/http-status-codes...
