const router = require('express').Router();
const { validateObjId, validateCardBody } = require('../middlewares/validatons');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCardBody, createCard);
router.delete('/:id', validateObjId, deleteCard);
router.put('/:id/likes', validateObjId, likeCard);
router.delete('/:id/likes', validateObjId, dislikeCard);

module.exports = router;
