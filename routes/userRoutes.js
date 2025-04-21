const app = require('express');
const { signUpController , verifyOtp } = require('../controllers/user');
const { veriFyUserToken } = require('../utils/tokenGenerator');
const userRouter = app.Router();

userRouter.route('/signup').post(signUpController);
userRouter.route('/verifyEmail').post(veriFyUserToken,verifyOtp);

module.exports = {
    userRouter
}