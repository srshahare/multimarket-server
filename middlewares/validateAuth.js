const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JSON_SECRET_KEY;

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        type: "Unauthorized Access!",
        message: "The authorization token not found",
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        type: "Unauthorized Access!",
        message: "The authorization token not found",
      });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if(err) {
        return res.status(401).json({
          type: "Unauthorized Access!",
          message: "The authorization token is not valid",
        });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      type: "Unauthorized Access!",
      message: "The authorization token is not valid",
    });
  }
};

module.exports = {
    validateToken
}
