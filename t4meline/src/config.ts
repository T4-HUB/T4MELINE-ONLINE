// config.ts
import io from 'socket.io-client';
export const API_URL_LOCAL = "http://localhost:3001/";

export const API_URL = "https://w41-api.onrender.com/";
export const socket = io(API_URL)
