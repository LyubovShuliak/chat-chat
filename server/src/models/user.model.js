const userDatabase = require("./user.mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
async function verifyTokenAsync(token) {
  if (!token) return reject({ error: "No access token" });
  return new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWTKEY, (err, decoded) =>
      err ? reject({ err }) : resolve(decoded)
    )
  );
}
async function signTokenAsync(email) {
  if (!email) return eject({ error: "No email" });
  return new Promise((resolve, reject) =>
    jwt.sign(
      { email },
      process.env.JWTKEY,
      {
        expiresIn: "24h",
      },
      (err, decoded) => (err ? reject({ err }) : resolve(decoded))
    )
  );
}

async function findUserByUser(email) {
  return await userDatabase.findOne({ email: email }, "password id");
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
}

async function logIn(user) {
  const { password, email } = user;

  const userPassword = await findUserByUser(email);

  if (!userPassword) {
    return new Error("You must sign up");
  }

  return await bcrypt.compare(password, userPassword.password);
}
async function verifyToken(token) {
  const encoded = await verifyTokenAsync(token);

  return encoded;
}

async function signToken(email) {
  const encoded = await signTokenAsync(email);

  console.log("signToken", encoded);
  return encoded;
}
module.exports = {
  signUp,
  logIn,
  verifyToken,
  signToken,
};
