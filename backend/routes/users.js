const userRouter = require('express').Router();
const { celebrate } = require('celebrate');

const { findUserJoiObj, updateUserJoiObj, updateAvatarJoiObj } = require('../utils/utils');

const {
  getUsers, findUser, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getUserInfo);

userRouter.get('/:userId', celebrate({ params: findUserJoiObj }), findUser);

userRouter.patch('/me', celebrate({ body: updateUserJoiObj }), updateUser);

userRouter.patch('/me/avatar', celebrate({ body: updateAvatarJoiObj }), updateAvatar);

module.exports = userRouter;
