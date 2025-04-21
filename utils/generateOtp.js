exports.generateOtp = () => {
  const otpContainer = [];
  for (let i = 0; i < 5; i++) {
    otpContainer.push(Math.floor(Math.random() * 9));
  }
  let otp = otpContainer.join("");
  return parseInt(otp);
};