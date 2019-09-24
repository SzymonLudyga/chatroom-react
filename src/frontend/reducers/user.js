import { USER_LOGIN } from '../actions/types';

const initialState = {
    username: null,
};

export default function user(state = initialState, action) {
    if (action.type === USER_LOGIN) {
        return {
            ...state,
            username: action.username
        };
    } 
    return state;
}