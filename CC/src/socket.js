import { io } from 'socket.io-client';
import { SOCKET_SERVER_URL } from './config/api';

export const socket = io(SOCKET_SERVER_URL);