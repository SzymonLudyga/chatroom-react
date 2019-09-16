import { apiGetMessages, apiDeleteMessages } from '../api/api';
import { MESSAGES_RECEIVED } from './types';

function _messagesReceived(messages) {
    return {
        type: MESSAGES_RECEIVED,
        messages,
    };
}

export function fetchMessages() {
    return async (dispatch) => {
        try {
            const res = await apiGetMessages();
            if (res.status !== 200) {
                throw Error('Error fetching messages');
            }
            dispatch(_messagesReceived(res.data.messages));
        } catch (e) {
            console.log(e);
        }
    };
}

export function deleteMessages() {
    return async (dispatch) => {
        try {
            const res = await apiDeleteMessages();
            if (res.status !== 200) {
                throw Error('Error fetching messages');
            }
            dispatch(fetchMessages());
        } catch (e) {
            console.log(e);
        }
    };
}
