const routerCard = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

routerCard.get('/cards', getCards); // возвращает все карточки

routerCard.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(
      // eslint-disable-next-line no-useless-escape
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/mi,
      ),
    }),
  }),
  createCard,
); // создаёт карточку
routerCard.delete(
  '/cards/:cardId',
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteCard,
); // удаляет карточку по идентификатору

routerCard.put(
  '/cards/:cardId/likes',
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  setLikeCard,
); // поставить лайк карточке

routerCard.delete(
  '/cards/:cardId/likes',
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteLikeCard,
); // убрать лайк с карточки

module.exports = routerCard;
