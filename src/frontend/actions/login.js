import { apiCallWithData, authApiCall } from '../api/api';

import { USER_UPDATE } from './types';

function _userUpdated(userData) {
    return {
        type: USER_UPDATE,
        userData,
    }
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
                token: res.data.tokens[res.data.tokens.length-1].token 
            }));
        } catch (e) {
            console.log(e);
        }
    };
}

export function logout(userInfo) {
    return async (dispatch) => {
        try {
            const res = await authApiCall('delete', 'users/token', userInfo);
            if (res.status !== 200) {
                throw Error('Error Logout');
            }
            dispatch(_userUpdated({ 
                username: null, 
                token: null
            }))
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
            dispatch(_userUpdated(userCredentials.name))
        } catch (e) {
            console.log(e);
        }
    };
}
