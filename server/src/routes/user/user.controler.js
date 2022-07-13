const {
  signUp,
  logIn,
  verifyTokenAsync,
  signTokenAsync,
  findUserByEmail,
  addAvatar,
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
  const response = await signUp(user);
  if (response.error) {
    return res.status(409).json({
      error: response.error,
    });
  }

  try {
    const token = await signTokenAsync(email);

    return res.status(200).json({
      token,
      user: {
        email,
        userName,
        id: response.id,
      },
    });
  } catch (error) {
    res.status(400).send({ error });
  }
}

async function httpLoggin(req, res) {
  const user = req.body;

  if (!user.password || !user.email) {
    return res.status(400).json({
      error: "Missing one or more required credentials",
    });
  }

  const response = await logIn(user);
  if (response.error) {
    return res.status(400).send({
      error: response.error,
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
      const user = await findUserByEmail(decoded.email);
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
async function httpAddAvatar(req, res) {
  const { email, avatar } = req.body;

  const user = await addAvatar(email, avatar);

  return res.status(200).json(user);
}

module.exports = {
  httpSignUp,
  httpLoggin,
  httpCheckToken,
  httpAddAvatar,
};
