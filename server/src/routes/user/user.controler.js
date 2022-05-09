const {
  signUp,
  logIn,
  signToken,
  verifyToken,
} = require("../../models/user.model");

require("dotenv").config();

async function httpSignUp(req, res) {
  const user = req.body;

  const { password, userName, email } = user;

  if (!password || !userName || !email) {
    return res.status(400).json({
      error: "Missing one or more required credentials",
    });
  }
  const errorMessage = await signUp(user);
  if (errorMessage) {
    return res.status(409).json({
      error: errorMessage.error,
    });
  }

  const token = await signToken(user.email);
  return res.status(200).json({
    token,
  });
}

async function httpLoggin(req, res) {
  const user = req.body;

  if (!user.password || !user.email) {
    return res.status(400).json({
      error: "Missing one or more required credentials",
    });
  }

  const response = await logIn(user);
  if (response.message) {
    return res.status(400).send({
      error: response.message,
    });
  }
  const token = await signToken(user.email);

  return res.status(200).send({
    token,
  });
}

async function httpCheckToken(req, res, next) {
  const token = req.body.token;
  try {
    const decoded = await verifyToken(token);

    const newToken = await signToken(decoded.email);
    res.send({ token: newToken });
    return next();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

module.exports = {
  httpSignUp,
  httpLoggin,
  httpCheckToken,
};
