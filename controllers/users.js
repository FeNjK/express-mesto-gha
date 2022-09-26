const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../errors/http-status-codes');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = async (req, res, next) => {
  console.log(req.user);
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    /* console.log(err); */
    next(err);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(
        'Пользователь с указанным _id не найден.',
      );
    }
    res.send(user);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      next(new BadRequestError(
        'Поиск осуществляется по некорректным данным.',
      ));
      return;
    }
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError(
        'Пользователь с указанным _id не найден.',
      );
    }
    res.send(user);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      next(new BadRequestError(
        'Поиск осуществляется по некорректным данным.',
      ));
      return;
    }
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    // хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    // записываем данные в базу
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword, // пердаём уже хэшированный пароль
    });
    // возвращаем записанные в базу данные пользователя
    res.send(user);
    // если данные не записались, вернём ошибку
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'ValidationError') {
      next(new BadRequestError(
        'Переданы некорректные данные при создании пользователя.',
      ));
      return;
    }
    if (err.name === 'MongoServerError') {
      next(new ConflictError(
        'Пользователь с таким email уже существует.',
      ));
      return;
    }
    next(err);
  }
};

const editUserData = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      // Передадим объект опций:
      {
        new: true, // метод вернёт обновлённую запись
        runValidators: true, // вылидируем данные перд сохранением данных
      },
    );
    if (!user) {
      throw new NotFoundError(
        'Пользователь с указанным _id не найден.',
      );
    }
    res.send(user);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении профиля.',
        ),
      );
      return;
    }
    next(err);
  }
};

const editUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      // Передадим объект опций:
      {
        new: true, // передаём на вход обновлённую запись
        runValidators: true, // вылидируем данные перд изменением
      },
    );
    if (!user) {
      throw new NotFoundError(
        'Пользователь с указанным _id не найден.',
      );
    }
    res.send(user);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении профиля.',
        ),
      );
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Чтобы реализовать передачу хеша пароля при аутентификации
    // после вызова метода модели нужно добавить вызов метода select,
    // передав ему строку '+password'
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError(
        'Произошла ошибка авторизации. Введите правильные логин и пароль.',
      );
    }
    if (!email || !password) {
      throw new BadRequestError(
        'Пожалуйста, заполните все поля ввода.',
      );
    }
    const authorizedUser = await bcrypt.compare(password, user.password);
    /* console.log(authorizedUser); */
    if (!authorizedUser) {
      throw new UnauthorizedError(
        'Произошла ошибка авторизации. Введите правильные логин и пароль.',
      );
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    // сохраняем токен в куки
    // делаем защиту от автоматической отправки кук (CSRF)
    res.cookie('jwt', token, {
      maxAge: 3600000, // продолжительность жизни куки в миллисекундах
      httpOnly: true, // из JS до этих кук мы не дотянемся
      sameSite: true, // данная кука может работать только с текущим доменом
    });
    res.send(user.toJSON());
    /* res.send({ token }); */
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserMe,
  getUserById,
  createUser,
  editUserData,
  editUserAvatar,
  login,
};
