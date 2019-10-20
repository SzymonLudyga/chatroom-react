import { apiCall, apiCallWithData, authApiCallWithData } from '../api/api';
import { 
    ROOMS_RECEIVED,
    ROOM_CHOSEN,
    ROOM_CREATED,
    ROOM_DELETED,
    OPEN_ROOM_MODAL,
    CLOSE_ROOM_MODAL
} from './types';

import { errorDisplay } from './error'

function _roomsReceived(rooms) {
    return {
        type: ROOMS_RECEIVED,
        rooms,
    };
}

function _roomChosen(room) {
    return {
        type: ROOM_CHOSEN,
        room,
    };
}

function _roomCreated(room) {
    return {
        type: ROOM_CREATED,
        room,
    };
}

function _roomDeleted(room) {
    return {
        type: ROOM_DELETED,
        room,
    };
}

export function fetchRooms() {
    return async (dispatch) => {
        try {
            const res = await apiCall('get', 'rooms');
            if (res.status !== 200) {
                throw Error('Error fetching rooms');
            }
            dispatch(_roomsReceived(res.data));
        } catch (e) {
            console.log(e);
        }
    };
}

export function deleteRoom(room) {
    return async (dispatch) => {
        try {
            // const { tokenInfo } = getState().user.userInfo.token;
            // const res = await authApiCallWithData('delete', 'rooms', tokenInfo, { room });
            const res = await apiCallWithData('delete', 'rooms', { room });
            if (res.status !== 200) {
                throw Error('Error deleting room');
            }
            console.log(res)
            dispatch(_roomDeleted(res.data.name));
        } catch (e) {
            console.log(e);
        }
    };
}

export function confirmRoom(room) {
    return async (dispatch) => {
        try {
            const res = await apiCallWithData('post', 'rooms/choose', { room });
            if (res.status !== 200) {
                throw Error('Error confirmin room');
            }
            dispatch(_roomChosen(res.data.room));
        } catch (e) {
            console.log(e);
        }
    };
}

export function createRoom(data) {
    return async (dispatch) => {
        try {
            const res = await apiCallWithData('post', 'rooms', data);
            if (res.status !== 200) {
                throw Error('Error confirming room');
            }
            console.log(res.data);
            dispatch(_roomCreated(res.data));
            dispatch(closeRoomModal());
        } catch (e) {
            console.log(e.response);
            dispatch(errorDisplay({ 
                errorType: e.response.data.errorType, 
                errorMessage: e.response.data.errorMessage 
            }));
        }
    };
}

export function openRoomModal() {
    return {
        type: OPEN_ROOM_MODAL,
    }
}

export function closeRoomModal() {
    return {
        type: CLOSE_ROOM_MODAL,
    }
}
