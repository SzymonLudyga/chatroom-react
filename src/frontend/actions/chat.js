import { apiGetMessages, apiDeleteMessages } from '../api/api';
import { MESSAGES_RECEIVED } from './types';

function messagesReceived(messages) {
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
            dispatch(messagesReceived(res.data.messages));
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
            // dispatch(messagesReceived(res.data.rooms));
        } catch (e) {
            console.log(e);
        }
    };
}
