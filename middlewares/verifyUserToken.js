const ErrorResponse = require("../utils/errorResponse");
var jwt = require("jsonwebtoken");

const verifyUserToken = (req, res, next) => {
  // console.log("Executed verifyUserToken in authentication in middlewware")
  // console.log(req.originSource);
  let token;
  if (req.originSource === "ANOTHER") {
    if (req.query.api_key === undefined) return next(new ErrorResponse("Missing API Key", 401));
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer')) return next(new ErrorResponse("Unauthorized access", 401));
    token = req.headers.authorization.split(" ")[1];
  } else if (req.originSource === "MAIN") {
    // console.log("HERE I WAS")
    token = req.cookies["db_userAccessToken"];
    if (token === undefined || token === null) return next(new ErrorResponse("Session Expired", 404));
  } else {
    token = req.cookies["supportUserAccessToken"];
    if (token === undefined || token === null) return next(new ErrorResponse("Session Expired", 404));
  }

  jwt.verify(token, process.env.D_B_SECRET_KEY, (err, decoded) => {
    // console.log(decoded)
    if (err) return next(new ErrorResponse("Invalid token", 403));
    (req.userId = decoded.UserInfo.userId), (req.user =
      decoded.UserInfo.user), (req.roles =
        decoded.UserInfo.roles), (req.userMetamask =
          decoded.UserInfo.userMetamask);
    next();
  });
};

module.exports = verifyUserToken;
