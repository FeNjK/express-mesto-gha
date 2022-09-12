const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/http-status-codes');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload; // Payload — это полезные данные, которые хранятся внутри JWT.
  try {
    // проверяем подписи/содержимого payload
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    // console.log(payload);
    // где iat - время создания,
    // а exp - сколько осталось жить куке))
  } catch (err) {
    next(new UnauthorizedError('Пользователь не авторизован.'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  /* console.log(req.user); */
  next(); // пропускаем запрос дальше
};

module.exports = auth;
