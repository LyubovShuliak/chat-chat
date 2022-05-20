import { io } from "socket.io-client";

const url = "http://localhost:3050/";
const socketApi = io(url, { autoConnect: false });

export { socketApi };
