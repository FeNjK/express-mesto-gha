const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/http-status-codes');

const getUsers = async (req, res) => {
  try {
    const users = await User.find(req);
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(NOT_FOUND).send({
      message: 'В базе данных отсутствуют данные о пользователях',
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    // проводим сравнение и если это не наш случай, то двигаемся дальше
    if (!user) {
      res.status(NOT_FOUND).send({
        message: 'Пользователь с указанным _id не найден',
      });
      return;
    }
    res.send(user);
  } catch (err) {
    console.log(err);
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'Поиск осуществляется по некоректным данным',
      });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла внутренныя ошибка сервера',
      });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    // записываем данные в базу
    const user = await User.create({
      name,
      about,
      avatar,
    });
    // возвращаем записанные в базу данные пользователя
    res.send(user);
  } catch (err) {
    // если данные не записались, вернём ошибку
    console.log(err);
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({
      message: 'Произошла внутренныя ошибка сервера',
    });
  }
};

const editUserData = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.body._id,
      { name, about },
      // Передадим объект опций:
      {
        new: true, // передаём на вход обновлённую запись
        runValidators: true, // вылидируем данные перд изменением
      },
    );
    if (!user) {
      res.status(NOT_FOUND).send({
        message: 'Пользователь с указанным _id не найден',
      });
      return;
    }
    res.send(user);
  } catch (err) {
    // если данные не записались, вернём ошибку
    console.log(err);
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла внутренныя ошибка сервера',
      });
    }
  }
};

const editUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.body._id,
      { avatar },
      // Передадим объект опций:
      {
        new: true, // передаём на вход обновлённую запись
        runValidators: true, // вылидируем данные перд изменением
      },
    );
    if (!user) {
      res.status(NOT_FOUND).send({
        message: 'Пользователь с указанным _id не найден',
      });
      return;
    }
    res.send(user);
  } catch (err) {
    // если данные не записались, вернём ошибку
    console.log(err);
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла внутренныя ошибка сервера',
      });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUserData,
  editUserAvatar,
};
