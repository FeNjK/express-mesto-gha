const User = require('../models/user');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/http-status-codes');

const getUsers = (req, res) => {
  User.find(req)
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(NOT_FOUND)
        .send({ message: 'В базе данных отсутствуют данные о пользователях' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь с таким id отсутствует в базе данных' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // записываем данные в базу
  User.create({
    name,
    about,
    avatar,
  })
    // возвращаем записанные в базу данные пользователя
    .then((user) => {
      res.send({ data: user });
    })
    // если данные не записались, вернём ошибку
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Произошла внутренныя ошибка сервера',
        });
      }
    });
};

const editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.body._id,
    { name, about },
    // Передадим объект опций:
    { new: true, runValidators: true },
  )
    .then((user) => {
      // проводим сравнение и если это не наш случай, то двигаемся дальше
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.status(OK).send({ data: user } && {
        message: 'Обновление данных пользователя успешно завершено',
      });
    })
    // если данные не записались, вернём ошибку
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Произошла внутренныя ошибка сервера',
        });
      }
    });
};

const editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.body._id,
    { avatar },
    // Передадим объект опций:
    { new: true, runValidators: true },
  )
    .then((user) => {
      // проводим сравнение и если это не наш случай, то двигаемся дальше
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.status(OK).send({ data: user } && {
        message: 'Обновление аватара успешно завершено',
      });
    })
    // если данные не записались, вернём ошибку
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Произошла внутренныя ошибка сервера',
        });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUserData,
  editUserAvatar,
};
