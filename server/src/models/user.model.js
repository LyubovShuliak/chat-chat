const userDatabase = require("./user.mongo");

async function signUp(user) {
  return await userDatabase.insertMany(user);
}

module.exports = {
  signUp,
};
