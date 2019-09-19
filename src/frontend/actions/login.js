import { apiRegister, apiLogin } from '../api/api';

export function login(userCredentials) {
    return async (dispatch) => {
        try {
            const res = await apiLogin(userCredentials);
            if (res.status !== 200) {
                throw Error('Error Login');
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export function register(userCredentials) {
    console.log(userCredentials);
    return async (dispatch) => {
        try {
            const res = await apiRegister(userCredentials);
            if (res.status !== 200) {
                throw Error('Error Register');
            }
        } catch (e) {
            console.log(e);
        }
    };
}
