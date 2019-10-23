import { apiCallWithData, authApiCallWithData, authApiCall } from '../api/api';

import { USER_UPDATE, TOKEN_UPDATE } from './types';

function _userUpdated(userData) {
    return {
        type: USER_UPDATE,
        userData,
    };
}

function _tokenUpdated(token) {
    return {
        type: TOKEN_UPDATE,
        token,
    };
}

export function login(userCredentials) {
    return async (dispatch) => {
        try {
            const res = await apiCallWithData('post', 'users/login', userCredentials);
            if (res.status !== 200) {
                throw new Error('Error Login');
            }
            dispatch(_userUpdated({
                username: userCredentials.name,
                token: {
                    tokenInfo: res.data.tokens[res.data.tokens.length - 1].token,
                    timestamp: res.data.tokens[res.data.tokens.length - 1].timestamp
                }
            }));
        } catch (e) {
            console.log(e);
        }
    };
}

export function refreshToken() {
    return async (dispatch, getState) => {
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            const res = await authApiCall('get', 'users/refresh-token', tokenInfo);
            if (res.status !== 200) {
                throw new Error('Error Token');
            }
            dispatch(_tokenUpdated({
                tokenInfo: res.data.tokens[res.data.tokens.length - 1].token,
                timestamp: res.data.tokens[res.data.tokens.length - 1].timestamp
            }));
        } catch (e) {
            console.log(e);
        }
    };
}

export function logout(username) {
    return async (dispatch, getState) => {
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            const res = await authApiCallWithData('delete', 'users/token', tokenInfo, { username });
            if (res.status !== 200) {
                throw new Error('Error Logout');
            }
            dispatch(_userUpdated({
                username: null,
                token: {
                    tokenInfo: null,
                    timestamp: null
                }
            }));
        } catch (e) {
            console.log(e);
        }
    };
}

export function register(userCredentials) {
    return async (dispatch) => {
        try {
            const res = await apiCallWithData('post', 'users/register', userCredentials);
            if (res.status !== 200) {
                throw new Error('Error Register');
            }
            dispatch(_userUpdated({
                username: userCredentials.name,
                token: {
                    tokenInfo: res.data.tokens[res.data.tokens.length - 1].token,
                    timestamp: res.data.tokens[res.data.tokens.length - 1].timestamp
                }
            }));
        } catch (e) {
            console.log(e);
        }
    };
}
