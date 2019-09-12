import { MESSAGES_RECEIVED } from '../actions/types';

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
    return state;
}
