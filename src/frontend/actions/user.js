import { USER_LIST_RECEIVED } from './types';

export default function updateUserList(userList) {
    return {
        type: USER_LIST_RECEIVED,
        userList,
    };
}
