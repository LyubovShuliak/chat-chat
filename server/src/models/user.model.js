const userDatabase = require("./user.mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
async function verifyTokenAsync(token) {
  if (!token) return { error: "No access token" };
  return new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWTKEY, (err, decoded) =>
      err ? reject({ err }) : resolve(decoded)
    )
  );
}
async function signTokenAsync(email) {
  if (!email) return { error: "No email" };
  return new Promise((resolve, reject) =>
    jwt.sign(
      { email },
      process.env.JWTKEY,
      {
        expiresIn: "24h",
      },
      (err, encoded) => (err ? reject({ err }) : resolve(encoded))
    )
  );
}

async function getAllUsers(limit, skip) {
  const contacts = await userDatabase
    .find({}, "userName")
    .skip(skip)
    .limit(limit);
  return contacts;
}

async function findUserByUser(email) {
  return await userDatabase.findOne(
    { email: email },
    "password id email userName"
  );
}
async function findBySearchQuery(searchQuery) {
  const findByName = await userDatabase
    .find({ name: `/${searchQuery}/` }, { __v: 0, _id: 0 })
    .limit(20);
  return findByName;
}
async function signUp(user) {
  const { password, email } = user;
  const saltRounds = 10;

  const doesUserAlreadySignUp = await findUserByUser(email);

  if (doesUserAlreadySignUp) {
    return {
      error:
        "You already signed up with this email. Do you want to login whith your credetials?",
    };
  }

  const newUser = {
    ...user,
    id: uuidv4(),
  };

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    try {
      await userDatabase.insertMany({
        ...newUser,
        password: hash,
      });
      return;
    } catch (err) {
      console.error(err);
    }
  });
  return { userName: newUser.userName, email: newUser.email };
}

async function logIn(user) {
  const { password, email } = user;

  const userPassword = await findUserByUser(email);

  if (!Object.keys(userPassword).length) {
    return new Error("You must sign up");
  }

  await bcrypt.compare(password, userPassword.password);
  return { userName: userPassword.userName, email: userPassword.email };
}

async function downLoadAvtar(blob, email) {
  const user = await userDatabase.findByIdAndUpdate(
    { email: email },
    { avatar: blob }
  );
  return user;
}

module.exports = {
  getAllUsers,
  signUp,
  logIn,
  verifyTokenAsync,
  signTokenAsync,
  findBySearchQuery,
  findUserByUser,
  downLoadAvtar,
};
