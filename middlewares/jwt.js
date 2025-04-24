const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  console.log("inside jwtMiddleware");

  if (!req.headers["authorization"]) {
    return res.status(406).json("Authentication failed... token missing");
  }

  const token = req.headers["authorization"].split(" ")[1];
  console.log("Token:", token);

  if (token) {
    try {
      const jwtResponse = jwt.verify(token, process.env.JWT_PASSWORD);
      console.log("JWT Decoded:", jwtResponse);

      req.user = { id: jwtResponse.userId };  // <-- Fixed here
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      res.status(401).json("Please login to process the step! Authentication failed...");
    }
  } else {
    res.status(406).json("Authentication failed... token missing");
  }
};

module.exports = jwtMiddleware;
