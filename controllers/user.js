const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/tokenGenerator");
const { generateOtp } = require("../utils/generateOtp");
const { mailer } = require("../utils/sendMail");
const { emailTemplate } = require("../template/emailTemplate");

exports.signUpController = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, gender } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender) {
      return res.status(400).json({ message: "Please enter all details." });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already used." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      gender,
      otp,
    });
    res.cookie("token", generateToken(newUser._id, newUser.role), {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });
    mailer(
      newUser.email,
      "ChatApp Email Verification",
      emailTemplate(newUser.otp, "ChatApp Email Verification")
    );
    return res.status(201).json({ message: "Registered successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { id } = req.user;
    const { otp } = req.body;
    const findUser = await User.findOne({ _id: id });
    if (findUser.otp === otp) {
      findUser.otp = null;
      findUser.isUser = true;
      await findUser.save();
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
      });
      return res.status(200).json({ message: "Email Verified." });
    } else {
      return res.status(400).json({ message: "Invalid Otp." });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.loginController = async (req, res) => {
  const {} = req.body;
};