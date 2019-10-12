import { apiCallWithData, authApiCallWithData } from '../api/api';

import { USER_UPDATE } from './types';

function _userUpdated(userData) {
    return {
        type: USER_UPDATE,
        userData,
    };
}

export function login(userCredentials) {
    return async (dispatch) => {
        try {
            const res = await apiCallWithData('post', 'users/login', userCredentials);
            if (res.status !== 200) {
                throw Error('Error Login');
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

export function logout(username) {
    return async (dispatch, getState) => {
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            const res = await authApiCallWithData('delete', 'users/token', tokenInfo, { username });
            if (res.status !== 200) {
                throw Error('Error Logout');
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
                throw Error('Error Register');
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
