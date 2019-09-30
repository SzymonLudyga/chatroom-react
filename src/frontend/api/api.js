import axios from 'axios';
import { baseUrl } from '../config/config';

export async function apiGetRooms() {
    return await axios.get(`${baseUrl}/api/rooms`);
}

export async function apiPostRoom(room) {
    return await axios.post(`${baseUrl}/api/rooms`, { room });
}

export async function apiGetMessages(room) {
    return await axios.get(`${baseUrl}/api/messages/${room}`);
}

export async function apiDeleteMessages() {
    return await axios.delete(`${baseUrl}/api/messages`);
}

export async function apiRegister(userCredentials) {
    return await axios.post(`${baseUrl}/api/users/register`, userCredentials);
}

export async function apiLogin(userCredentials) {
    return await axios.post(`${baseUrl}/api/users/login`, userCredentials);
}

export async function apiLogout() {
    return await axios.delete(`${baseUrl}/api/users/token`);
}
