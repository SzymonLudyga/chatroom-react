import {
    MESSAGES_RECEIVED,
    MESSAGES_CLEARED,
    MESSAGE_ADDED
} from '../actions/types';

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
    if (action.type === MESSAGE_ADDED) {
        return {
            ...state,
            messages: state.messages.concat([action.data])
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
