import { authApiCall } from '../api/api';
import { MESSAGES_RECEIVED, MESSAGES_CLEARED, MESSAGE_ADDED } from './types';
import { errorDisplay } from './error';

function _messagesReceived(messages) {
    return {
        type: MESSAGES_RECEIVED,
        messages,
    };
}

export function clearMessages() {
    return {
        type: MESSAGES_CLEARED,
    };
}

export function addMessage(data) {
    return {
        type: MESSAGE_ADDED,
        data
    };
}

export function fetchMessages(room) {
    return async (dispatch, getState) => {
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            const res = await authApiCall('get', `messages/${room}`, tokenInfo);
            dispatch(_messagesReceived(res.data));
        } catch (e) {
            dispatch(errorDisplay({
                errorType: e.response.data.errorType,
                errorMessage: e.response.data.errorMessage
            }));
        }
    };
}

export function deleteMessages(room) {
    return async (dispatch, getState) => {
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            const res = await authApiCall('delete', `messages/${room}`, tokenInfo);
            dispatch(fetchMessages(room));
            dispatch(clearMessages());
        } catch (e) {
            dispatch(errorDisplay({
                errorType: e.response.data.errorType,
                errorMessage: e.response.data.errorMessage
            }));
        }
    };
}
