const { signUp, logIn } = require("../../models/user.model");

async function httpSignUp(req, res) {
  const user = req.body;

  if (!user.password || !user.userName) {
    return res.status(400).json({
      error: "Missing one or more required credentials",
    });
  }
  await signUp(user);
  return res.status(200).json({
    ok: true,
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

  return res.status(200).send({
    ok: response,
  });
}

module.exports = {
  httpSignUp,
  httpLoggin,
};
