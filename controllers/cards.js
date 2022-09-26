const Card = require('../models/card');
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/http-status-codes');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find(req);
    res.send(cards);
  } catch (err) {
    /* console.log(err); */
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    // записываем данные в базу
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    // возвращаем записанные в базу данные карточки
    res.send(card);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new BadRequestError(
        'Переданы некорректные данные при создании карточки.',
      ));
      return;
    }
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    const owner = req.user._id;
    if (!card) {
      throw new NotFoundError(
        'Карточка с указанным _id не найдена.',
      );
    }
    if (card.owner.toString() !== owner) {
      throw new ForbiddenError(
        'Вы не можете удалять чужие карточки!',
      );
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.send(card);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      next(new BadRequestError(
        'Переданы некорректный _id карточки при удалении.',
      ));
      return;
    }
    next(err);
  }
};

const setLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      throw new NotFoundError(
        'Карточка с указанным _id не найдена.',
      );
    }
    res.send(card);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      next(new BadRequestError(
        'Передан некорректный _id карточки при лайке.',
      ));
      return;
    }
    next(err);
  }
};

const deleteLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      throw new NotFoundError(
        'Карточка с указанным _id не найдена.',
      );
    }
    res.send(card);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      next(new BadRequestError(
        'Передан некорректный _id карточки при дизлайке.',
      ));
      return;
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
};

// Переработать удаление карточки в соответствии с рекомендациями ревью
//
// В card.owner._id хранится объект, его нужно передать в строку,
// тогда можно сравнить с  req.user._id - это во-первых.
// А во-вторых Card.findByIdAndRemove если находит карточку,
// то сразу удаляет. Поэтому нужно сначала найти карточку findById,
// проверить owner, а потом удалить или вернуть, что доступ запрещен.
