const {
  signUp,
  logIn,
  verifyTokenAsync,
  signTokenAsync,
  findUserByUser,
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

  const token = await signTokenAsync(user.email);
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
  const token = await signTokenAsync(user.email);

  if (token.error) {
    return res.status(400).send(token);
  }

  return res.status(200).send({
    token,
    user: response,
  });
}

async function httpCheckToken(req, res, next) {
  const token = req.body.token;
  console.log(token);

  try {
    const decoded = await verifyTokenAsync(token);

    if (!Object.keys(decoded).length) {
      return res.status(400).send({ error: "Token not valid" });
    }
    try {
      const newToken = await signTokenAsync(decoded.email);
      if (newToken.error) {
        return res.status(400).send(newToken);
      }
      const user = await findUserByUser(decoded.email);
      res.send({
        token: newToken,
        user: { userName: user.userName, email: user.email },
      });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
}

module.exports = {
  httpSignUp,
  httpLoggin,
  httpCheckToken,
};
