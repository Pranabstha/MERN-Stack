const jwt = require('jsonwebtoken');
// calling dotenv
require('dotenv').config();
const JWT_SECRET = process.env.JWT_KEY

const getUser = (req,res, next)=>{
    const token = req.header('AccessToken');
    
    if(!token){
        return res.status(401).json({
            error: true,
            message: 'Access Denied',
          });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({
            error: true,
            message: 'token miss matched',
          });
    }

}

module.exports = getUser