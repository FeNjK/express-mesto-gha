const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload; // Payload — это полезные данные, которые хранятся внутри JWT.
  try {
    payload = jwt.verify( // проверяем подписи/содержимого payload
      token,
      NODE_ENV === 'production'
        ? JWT_SECRET
        : 'dev-secret',
    );
    // console.log(payload);
    // где iat - время создания,
    // а exp - сколько осталось жить куке))
  } catch (err) {
    next(err);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};

module.exports = auth;
