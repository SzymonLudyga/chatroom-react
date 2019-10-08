import { USER_UPDATE, USER_LIST_RECEIVED } from '../actions/types';

const initialState = {
    userInfo: {
        username: null,
        token: null
    },
    userList: []
};

export default function user(state = initialState, action) {
    if (action.type === USER_UPDATE) {
        return {
            ...state,
            userInfo: {
                ...state.userInfo,
                username: action.userData.username,
                token: action.userData.token
            } 
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