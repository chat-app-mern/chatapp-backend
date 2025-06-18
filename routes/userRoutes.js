const app = require('express');
const {
    signUpController,
    verifyOtp,
    loginController,
    veriFyToken,
} = require('../controllers/user');
const { veriFyUserToken } = require('../utils/tokenGenerator');

const userRouter = app.Router();

userRouter.route('/signup').post(signUpController);
userRouter.route('/verifyEmail').post(veriFyUserToken, verifyOtp);
userRouter.route('/login').post(loginController);
userRouter.route('/check-user').post(veriFyToken);

module.exports = {
    userRouter,
};
