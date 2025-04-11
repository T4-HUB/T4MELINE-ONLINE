// config.ts
import io from 'socket.io-client';

export const API_URL = "http://172.20.10.3:3001";
export const socket = io(API_URL)
