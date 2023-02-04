const ErrorResponse = require("../utils/errorResponse");
var jwt = require('jsonwebtoken');

const verifyUserToken = (req,res,next) => {
    // console.log("Executed verifyUserToken in authentication in middlewware")
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer')) return next(new ErrorResponse("Unauthorized access", 401));
    // console.log(authHeader);
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(
        token,
        process.env.D_B_SECRET_KEY,
        (err, decoded) => {
            // console.log(decoded)
            if(err) return next(new ErrorResponse("Invalid token", 403));
            req.userId = decoded.UserInfo.userId,
            req.user = decoded.UserInfo.user,
            req.roles = decoded.UserInfo.roles,
            req.userMetamask = decoded.UserInfo.userMetamask
            next()
        }
    )
}

module.exports = verifyUserToken