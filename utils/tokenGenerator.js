const jwt = require('jsonwebtoken');
exports.generateToken=(id,role)=>{
    if(process.env.JWT_SECRET&&process.env.JWT_EXPIRE){
    const token = jwt.sign({id,role}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    return token;
}}

exports.veriFyUserToken = (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required.' });
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(400).json({ success: false, message: 'Please provide jwt secret key.' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized user' });
  }
};