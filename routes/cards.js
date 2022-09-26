const routerCard = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validURL } = require('../utils/regularExpressions');
const { joiIdValidation } = require('../utils/joiValidationFuction');

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
      link: Joi.string().required().regex(validURL),
    }),
  }),
  createCard,
); // создаёт карточку

routerCard.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().custom(joiIdValidation),
    }),
  }),
  deleteCard,
); // удаляет карточку по идентификатору

routerCard.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().custom(joiIdValidation),
    }),
  }),
  setLikeCard,
); // поставить лайк карточке

routerCard.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().custom(joiIdValidation),
    }),
  }),
  deleteLikeCard,
); // убрать лайк с карточки

module.exports = routerCard;
