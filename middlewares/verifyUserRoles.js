const ErrorResponse = require("../utils/errorResponse");
var jwt = require('jsonwebtoken');

const verifyUserRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return next(new ErrorResponse("Unauthorized access", 401));
        const rolesArray = [...allowedRoles];
        // console.log(rolesArray);
        // console.log(req.roles);
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result){
            return next(new ErrorResponse("Permission Denied", 403));
        }
        next();
    }
}

module.exports = verifyUserRoles