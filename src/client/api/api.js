import axios from 'axios';
import { baseUrl } from '../config/config';

export function auth(token) {
    return axios.get(`${baseUrl}${routes.auth}`, {
        headers: token
            ? {
                'x-access-token': token
            }
            : {}
    });
}
