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
async function addAvatar(email, avatar) {
  const user = await userDatabase
    .findOneAndUpdate({ email }, { avatar })
    .lean();
  return user;
}

async function getAllUsers(limit, skip, email) {
  const userIsContact = (await userDatabase.findOne({ email: email }).lean())
    .contacts;

  const contacts = await userDatabase
    .find(
      {},
      { _id: 0, __v: 0, password: 0, rooms: 0, contacts: 0, sessions: 0 }
    )
    .skip(skip)
    .limit(limit)
    .lean();
  return contacts.filter(
    (contact) =>
      userIsContact.findIndex((user) => user.email === contact.email) === -1
  );
}
async function getContacts(email) {
  const user = await userDatabase.findOne({ email: email }).lean();
  if (user) {
    return user.contacts;
  }
}

async function addContact(contact, email) {
  const user = await userDatabase
    .findOne({ email: email }, { __v: 0, _id: 0 })
    .lean();

  const contactAdded = user.contacts.findIndex(
    (userContact) => contact.email === userContact.email
  );

  if (contactAdded !== -1) return { error: "contact added" };
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
async function findUserByID(id) {
  return await userDatabase
    .findOne({ id: id }, { __v: 0, _id: 0, contacts: 0, password: 0 })
    .lean();
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
    contacts: [],
    sessions: [],
    avatar: "none",
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
  return { userName: newUser.userName, email: newUser.email, id: newUser.id };
}

async function logIn(user) {
  const { password, email } = user;

  const userPassword = await findUserByEmail(email);

  if (!userPassword) {
    return { error: "User not found" };
  }

  if (!Object.keys(userPassword).length) {
    return { error: "You must sign up" };
  }

  await bcrypt.compare(password, userPassword.password);
  return {
    userName: userPassword.userName,
    email: userPassword.email,
    id: userPassword.id,
  };
}

module.exports = {
  verifyTokenAsync,
  signTokenAsync,
  addAvatar,
  getAllUsers,
  getContacts,
  addContact,
  findUserByEmail,
  findUserByID,
  getUserContacts,
  findBySearchQuery,
  signUp,
  logIn,
};
