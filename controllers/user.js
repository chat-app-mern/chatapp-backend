const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { generateToken } = require("../utils/tokenGenerator");

const generateOtp = () => {
  const otpContainer = [];
  for (let i = 0; i < 5; i++) {
    otpContainer.push(Math.floor(Math.random() * 9));
  }
  let otp = otpContainer.join("");
  return parseInt(otp);
};

const mailer = (email, otp, message) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.NODEMAILER_MAIL,
      pass: process.env.NODEMAILER_PASSCODE,
    },
  });
  const mailOptions = {
    from: process.env.NODEMAILER_MAIL,
    to: `${email}`,
    subject: `${message}`,
    text: "ChatApp Email Verification",
    html: emailTemplate(otp, message),
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

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
    });
    return res.status(201).json({ message: "Registered successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};