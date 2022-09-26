const BadRequestError = require('./bad-request-err'); // 400 - некорректный запрос данных
const UnauthorizedError = require('./unauthorized-err'); // 401- попытка несанкционированного доступа
const ForbiddenError = require('./forbidden-err'); // 401- попытка несанкционированного доступа
const NotFoundError = require('./not-found-err'); // 404 - искомые данные не найдены
const ConflictError = require('./conflict-err'); // 409 - конфликт данных между клиентом и сервером

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};

// Вообще можно установить библиотеку http-status-codes
// командой npm install http-status-codes --save
// и вытаскивать оттуда статусы по инструкции, описанной по адресу
// https://github.com/prettymuchbryce/http-status-codes...
