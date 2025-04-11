// config.ts
import io from 'socket.io-client';

export const API_URL = "http://localhost:3001";
export const socket = io(API_URL)
