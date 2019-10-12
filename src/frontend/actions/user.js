import { USER_LIST_RECEIVED } from './types';

export function updateUserList(userList) {
    return {
        type: USER_LIST_RECEIVED,
        userList,
    };
}
