const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer" &&
      req.headers.authorization.split(" ")[1]
    ) {
      const theTokenInHeaders = req.headers.authorization.split(" ")[1];
      const dataInToken = jwt.verify(
        theTokenInHeaders,
        process.env.TOKEN_SECRET
      );
      req.payload = dataInToken;
      next();
    } else {
      res.status(400).json({ errorMessage: "Token not in headers" });
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ errorMessage: "Token invalid" });
  }
}

module.exports = { isAuthenticated };
