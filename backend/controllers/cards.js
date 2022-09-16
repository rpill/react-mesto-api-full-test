const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

// GET /cards
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// POST /cards
const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      return next(err);
    });
};

// DELETE /cards/:cardId
const deleteCard = (req, res, next) => {
  const { id } = req.params;
  return Card.findById(id)
    .orFail(() => new NotFoundError('Нет карточки по заданному id'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        // пользователь не может удалить карточку, которую он не создавал
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return Card.deleteOne(card)
        .then(() => res.send({ data: card }));
    })
    .catch(next);
};

const updateLike = (req, res, next, method) => {
  const { params: { id } } = req;
  return Card.findByIdAndUpdate(id, { [method]: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Нет карточки по заданному id'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// PUT /cards/:cardId/likes
const likeCard = (req, res, next) => updateLike(req, res, next, '$addToSet');

// DELETE /cards/:cardId/likes
const dislikeCard = (req, res, next) => updateLike(req, res, next, '$pull');

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
