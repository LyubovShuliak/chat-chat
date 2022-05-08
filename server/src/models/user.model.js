const userDatabase = require("./user.mongo");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

async function findUserByUser(email) {
  return await userDatabase.findOne({ email: email }, "password");
}

async function signUp(user) {
  const { password } = user;
  const saltRounds = 10;

  return bcrypt.hash(password, saltRounds, async (err, hash) => {
    try {
      return await userDatabase.insertMany({
        ...user,
        password: hash,
        id: uuidv4(),
      });
    } catch (err) {
      console.error(err);
    }
  });
}

async function logIn(user) {
  const { password, email } = user;

  const userPassword = await findUserByUser(email);

  if (!userPassword) {
    return new Error("You must sign up");
  }

  return await bcrypt.compare(password, userPassword.password);
}
module.exports = {
  signUp,
  logIn,
};
