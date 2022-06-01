const userDatabase = require("../models/user.mongo");

function socketConnected(socket, io) {
  console.log(socket.id + " connected");
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    email: socket.email,
  });
  socket.on("private message", async ({ content, to }) => {
    const senderEmail = socket.handshake.auth.email;

    console.log(`${senderEmail} sent a private message "${content}" to ${to}`);
    const sender = await userDatabase
      .findOne({ email: senderEmail }, { __v: 0, _id: 0 })
      .lean();
    const receiver = await userDatabase
      .findOne({ id: to }, { __v: 0, _id: 0 })
      .lean();

    const senderRoom = {
      ...sender.rooms[receiver.email],
      messages: sender.rooms[receiver.email].messages.concat([
        {
          messageType: "user",
          message: content,
        },
      ]),
    };
    const receiverRoom = {
      ...receiver.rooms[sender.email],
      messages: receiver.rooms[sender.email].messages.concat([
        {
          messageType: "responder",
          message: content,
        },
      ]),
    };

    await userDatabase
      .findOneAndUpdate(
        { email: sender.email },
        { rooms: { ...sender.rooms, [receiver.email]: senderRoom } },
        { __v: 0, _id: 0 }
      )
      .lean()
      .catch((err) => console.log("err,", err, { email: sender.email }));

    await userDatabase.findOneAndUpdate(
      { email: receiver.email },
      { rooms: { ...receiver.rooms, [sender.email]: receiverRoom } }
    );

    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });
}

module.exports = { socketConnected };
