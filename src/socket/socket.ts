import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_URL_SOCKET || 'http://localhost:3000';

export const socket = io(SOCKET_URL);