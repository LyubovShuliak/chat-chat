function socketConnected(socket, io) {
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    email: socket.email,
  });
  socket.on("chat message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });
}

module.exports = { socketConnected };
