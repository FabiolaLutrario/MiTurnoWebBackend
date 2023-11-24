const jwt = require("jsonwebtoken");

const generateToken = (payload, duration) => {
  const token = jwt.sign({ user: payload }, process.env.SECRET, {
    expiresIn: `${duration}`,
  });
  return token;
};

const validateToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

module.exports = { generateToken, validateToken };
