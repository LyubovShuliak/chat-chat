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
    .find({}, { _id: 0, userName: 1, email: 1, id: 1 })
    .skip(skip)
    .limit(limit);
  return contacts;
}

async function addContact(contact, email) {
  const user = await userDatabase
    .findOne({ email: email }, { __v: 0, _id: 0 })
    .lean();

  const contactAdded = user.contacts.findIndex(
    (userContact) => contact.email === userContact.email
  );

  console.log("contactAdded", contactAdded);

  if (contactAdded) return { error: "contact added" };
  if (!user.contacts.length) {
    const contacts = {
      contacts: [contact],
    };
    await userDatabase.updateOne({ email: email }, contacts);
    return await findUserByEmail(email);
  } else {
    const contacts = {
      contacts: [...user.contacts, contact],
    };

    await userDatabase.updateOne({ email: email }, contacts);
    return await findUserByEmail(email);
  }
}
async function findUserByEmail(email) {
  return await userDatabase.findOne({ email: email });
}
async function getUserContacts(email) {
  return await userDatabase.findOne({ email: email }, "contacts");
}
async function findBySearchQuery(searchQuery) {
  const findByName = await userDatabase
    .find({ userName: `/${searchQuery}/` }, { __v: 0, _id: 0 })
    .limit(20);
  return findByName;
}
async function signUp(user) {
  const { password, email } = user;
  const saltRounds = 10;

  const doesUserAlreadySignUp = await findUserByEmail(email);

  if (doesUserAlreadySignUp) {
    return {
      error:
        "You already signed up with this email. Do you want to login with your credentials?",
    };
  }

  const newUser = {
    ...user,
    id: uuidv4(),
    rooms: [],
    contacts: [],
    sessions: [],
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

  const userPassword = await findUserByEmail(email);

  if (!Object.keys(userPassword).length) {
    return new Error("You must sign up");
  }

  await bcrypt.compare(password, userPassword.password);
  return { userName: userPassword.userName, email: userPassword.email };
}

module.exports = {
  verifyTokenAsync,
  signTokenAsync,
  getAllUsers,
  addContact,
  findUserByEmail,
  getUserContacts,
  findBySearchQuery,
  signUp,
  logIn,
};
