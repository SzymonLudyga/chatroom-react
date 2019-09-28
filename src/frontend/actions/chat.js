import { apiGetMessages, apiDeleteMessages } from '../api/api';
import { MESSAGES_RECEIVED } from './types';

function _messagesReceived(messages) {
    return {
        type: MESSAGES_RECEIVED,
        messages,
    };
}

export function fetchMessages(room) {
    return async (dispatch) => {
        try {
            const res = await apiGetMessages(room);
            if (res.status !== 200) {
                throw Error('Error fetching messages');
            }
            dispatch(_messagesReceived(res.data.msg));
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
