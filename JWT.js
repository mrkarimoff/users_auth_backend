const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign({ email: user.email, id: user.id }, process.env.ACCESS_TOKEN_SECRET);
  return accessToken;
};

const validateToken = (req, res, next) => {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization.split(" ")[1];
    const userId = req.headers.authorization.split(" ")[2];

    if (accessToken === null || userId === null) {
      return res.status(400).send({ message: "User is not authenticated" });
    }

    try {
      const isValidToken = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (isValidToken) {
        req.authenticated = true;
        return next();
      }
    } catch (error) {
      return res.status(400).send({ error: error });
    }
  }
};

module.exports = { createTokens, validateToken };
