import { apiRegister, apiLogin, apiLogout } from '../api/api';

import { USER_LOGIN } from './types';

function _userUpdated(username) {
    return {
        type: USER_LOGIN,
        username,
    }
}

export function login(userCredentials) {
    return async (dispatch) => {
        try {
            const res = await apiLogin(userCredentials);
            if (res.status !== 200) {
                throw Error('Error Login');
            }
            dispatch(_userUpdated(userCredentials.name))
        } catch (e) {
            console.log(e);
        }
    };
}

export function logout() {
    return async () => {
        try {
            const res = await apiLogout();
            if (res.status !== 200) {
                throw Error('Error Logout');
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export function register(userCredentials) {
    return async (dispatch) => {
        try {
            const res = await apiRegister(userCredentials);
            if (res.status !== 200) {
                throw Error('Error Register');
            }
            dispatch(_userUpdated(userCredentials.name))
        } catch (e) {
            console.log(e);
        }
    };
}
