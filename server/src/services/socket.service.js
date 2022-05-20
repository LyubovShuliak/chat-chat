function socketConnected(socket, io) {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
}

module.exports = { socketConnected };
