import {
    apiCallWithData,
    authApiCallWithData,
    authApiCall
} from '../api/api';

import { USER_UPDATE, TOKEN_UPDATE } from './types';
import { errorDisplay } from './error';

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
            const res = await apiCallWithData(
                'post',
                'users/login',
                userCredentials
            );
            dispatch(_userUpdated({
                username: userCredentials.name,
                token: {
                    tokenInfo:
                        res.data.tokens[res.data.tokens.length - 1].token,
                    timestamp:
                        res.data.tokens[res.data.tokens.length - 1].timestamp
                }
            }));
        } catch (e) {
            dispatch(errorDisplay({
                errorType: e.response.data.errorType,
                errorMessage: e.response.data.errorMessage
            }));
        }
    };
}

export function refreshToken() {
    return async (dispatch, getState) => {
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            const res = await authApiCall(
                'get',
                'users/refresh-token',
                tokenInfo
            );
            dispatch(_tokenUpdated({
                tokenInfo:
                    res.data.tokens[res.data.tokens.length - 1].token,
                timestamp:
                    res.data.tokens[res.data.tokens.length - 1].timestamp
            }));
        } catch (e) {
            dispatch(errorDisplay({
                errorType: e.response.data.errorType,
                errorMessage: e.response.data.errorMessage
            }));
        }
    };
}

export function logout(username) {
    return async (dispatch, getState) => {
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            await authApiCallWithData(
                'delete',
                'users/token',
                tokenInfo,
                { username }
            );
            dispatch(_userUpdated({
                username: null,
                token: {
                    tokenInfo: null,
                    timestamp: null
                }
            }));
        } catch (e) {
            dispatch(errorDisplay({
                errorType: e.response.data.errorType,
                errorMessage: e.response.data.errorMessage
            }));
        }
    };
}

export function register(userCredentials) {
    return async (dispatch) => {
        try {
            const res = await apiCallWithData(
                'post',
                'users/register',
                userCredentials
            );
            dispatch(_userUpdated({
                username: userCredentials.name,
                token: {
                    tokenInfo:
                        res.data.tokens[res.data.tokens.length - 1].token,
                    timestamp:
                        res.data.tokens[res.data.tokens.length - 1].timestamp
                }
            }));
        } catch (e) {
            dispatch(errorDisplay({
                errorType: e.response.data.errorType,
                errorMessage: e.response.data.errorMessage
            }));
        }
    };
}
