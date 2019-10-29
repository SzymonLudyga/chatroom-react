import axios from 'axios';
import baseUrl from '../config/config';

export async function apiCallWithData(method, resource, data) {
    return axios({
        method,
        url: `${baseUrl}/${resource}`,
        data
    });
}

export async function authApiCallWithData(method, resource, token, req) {
    return axios({
        method,
        url: `${baseUrl}/${resource}`,
        data: req,
        headers: { 'x-auth': token }
    });
}

export async function apiCall(method, resource) {
    return axios({
        method,
        url: `${baseUrl}/${resource}`,
        responseType: 'json'
    });
}

export async function authApiCall(method, resource, token) {
    return axios({
        method,
        url: `${baseUrl}/${resource}`,
        headers: { 'x-auth': token }
    });
}
