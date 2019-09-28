import { USER_LOGIN, USER_LIST_RECEIVED } from '../actions/types';

const initialState = {
    username: null,
    userList: []
};

export default function user(state = initialState, action) {
    if (action.type === USER_LOGIN) {
        return {
            ...state,
            username: action.username
        };
    } 
    if (action.type === USER_LIST_RECEIVED) {
        return {
            ...state,
            userList: action.userList
        };
    }
    return state;
}