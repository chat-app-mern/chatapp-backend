const jwt = require('jsonwebtoken');
exports.generateToken=(id,role)=>{
    if(process.env.JWT_SECRET&&process.env.JWT_EXPIRE){
    const token = jwt.sign({id,role}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    return token;
}}