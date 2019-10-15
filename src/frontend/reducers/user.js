import { USER_UPDATE, USER_LIST_RECEIVED, TOKEN_UPDATE } from '../actions/types';

const initialState = {
    userInfo: {
        username: null,
        token: {
            tokenInfo: null,
            timestamp: null
        }
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
                token: {
                    ...state.userInfo.token,
                    tokenInfo: action.userData.token.tokenInfo,
                    timestamp: action.userData.token.timestamp
                }
            }
        };
    }
    if (action.type === TOKEN_UPDATE) {
        return {
            ...state,
            userInfo: {
                ...state.userInfo,
                token: {
                    ...state.userInfo.token,
                    tokenInfo: action.token.tokenInfo,
                    timestamp: action.token.timestamp
                }
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
