const router = require('express').Router();
const {
  getUser, updateUserInfo, updateUserAvatar, getUsers, getCurrentUser,
} = require('../controllers/users');
const { validateObjId, validateAvatar, validateProfile } = require('../middlewares/validatons');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateObjId, getUser);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);
router.patch('/me', validateProfile, updateUserInfo);

module.exports = router;
