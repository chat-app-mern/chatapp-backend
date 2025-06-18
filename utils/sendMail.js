const nodemailer = require('nodemailer');

exports.mailer = (email, message ,emailTemplate) => {
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
    text: `${message}`,
    html: emailTemplate,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};