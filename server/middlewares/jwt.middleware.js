require("dotenv").config();
const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ errorMessage: "Authorization header missing" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
     res
      .status(401)
      .json({ errorMessage: "Authorization header malformed" });
      try {
        const decodedToken = jwt.verify(
          theTokenInHeaders,
          process.env.TOKEN_SECRET
        );
        req.payload = decodedToken;
        next();
      } catch (error) {
        res.status(403).json({ errorMessage: "Invalid Token" });
      }
    } else {
    res.status(403).json({ errorMessage: "Headers Malformed" });
  }
}

module.exports = { isAuthenticated };
