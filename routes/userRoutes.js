const app = require('express');
const { signUpController } = require('../controllers/user');
const userRouter = app.Router();

userRouter.route('/signup').post(signUpController);

module.exports = {
    userRouter
}