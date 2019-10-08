import axios from 'axios';
import { baseUrl } from '../config/config';

export async function apiCallWithData(method, resource, data) {
    console.log(data)
    return await axios({
        method,
        url: `${baseUrl}/${resource}`,
        data
    });
}

export async function authApiCall(method, resource, data) {
    console.log(data)
    return await axios({
        method,
        url: `${baseUrl}/${resource}`,
        data: {
            username: data.username
        },
        headers: {'x-auth': data.token}
    }
    );
}

export async function apiCall(method, resource) {
    console.log(resource);
    return await axios({
        method,
        url: `${baseUrl}/${resource}`,
        responseType: 'json'
    });
}
