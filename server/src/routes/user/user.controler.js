const { signUp } = require("../../models/user.model");

async function httpSignUp(req, res) {
  const user = req.body;

  if (!user.password || !user.userName) {
    return res.status(400).json({
      error: "Missing one or more required credentials",
    });
  }
  await signUp(user);
  return res.status(200).json(user);
}

module.exports = {
  httpSignUp,
};
