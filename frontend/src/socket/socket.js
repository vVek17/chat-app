import { io } from "socket.io-client";
const ENDPOINT = import.meta.env.VITE_BACKEND_URL;
const socket = io(ENDPOINT, {
	withCredentials: true,
	// transports: ["websocket"],
	// path: "/api/new/socket",
});

export default socket;
