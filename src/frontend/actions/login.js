import { apiCreateUser } from '../api/api';

export function login(userCredentials) {
    return async (dispatch) => {
        try {
            const res = await apiCreateUser(userCredentials);
            if (res.status !== 200) {
                throw Error('Error fetching rooms');
            }
        } catch (e) {
            console.log(e);
        }
    };
}
