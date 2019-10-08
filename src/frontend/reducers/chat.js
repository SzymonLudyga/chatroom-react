import { MESSAGES_RECEIVED, MESSAGES_CLEARED } from '../actions/types';

const initialState = {
    messages: [],
};

export default function chat(state = initialState, action) {
    if (action.type === MESSAGES_RECEIVED) {
        return {
            ...state,
            messages: action.messages
        };
    }
    if (action.type === MESSAGES_CLEARED) {
        return {
            ...state,
            messages: []
        };
    }
    return state;
}
