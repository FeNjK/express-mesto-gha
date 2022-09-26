const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/http-status-codes');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  /* console.log(token); */
  let payload; // Payload — это полезные данные, которые хранятся внутри JWT.
  try {
    if (!token) {
      next(new UnauthorizedError(
        'Произошла ошибка авторизации. Введите правильные логин и пароль.',
      ));
      return;
    }
    // проверяем подписи/содержимое payload
    payload = jwt.verify(
      token,
      NODE_ENV === 'production'
        ? JWT_SECRET
        : 'dev-secret',
    );
    // console.log(payload);
    // где iat - время создания,
    // а exp - сколько осталось жить куке))
  /* console.log(req.user); */
  } catch (err) {
    console.log(err);
    next(new UnauthorizedError(
      'Произошла ошибка авторизации. Введите правильные логин и пароль.',
    ));
    return;
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

module.exports = auth;
