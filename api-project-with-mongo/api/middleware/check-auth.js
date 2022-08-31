const JWT = require('jsonwebtoken');
module.exports = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decode = JWT.verify(token,"Test")
        req.userData = decode;
        next();    
    }catch(err){
        return res.status(401).json({
            message : "Auth faild"
        });
    }
};