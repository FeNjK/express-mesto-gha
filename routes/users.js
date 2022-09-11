const routerUser = require('express').Router(); // создали роутер

const {
  getUsers,
  getUserById,
  editUserData,
  editUserAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers); // возвращает всех пользователей
routerUser.get('/users/:userId', getUserById); // возвращает пользователя по _id
routerUser.patch('/users/me', editUserData); // обновляет профиль
routerUser.patch('/users/me/avatar', editUserAvatar); // обновляет аватар

module.exports = routerUser;
