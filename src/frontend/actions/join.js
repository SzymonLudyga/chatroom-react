import { apiCall, apiCallWithData, authApiCallWithData } from '../api/api';
import { 
    ROOMS_RECEIVED,
    ROOM_CHOSEN,
    ROOM_CREATED,
    ROOM_DELETED,
    OPEN_ROOM_MODAL,
    CLOSE_ROOM_MODAL,
    OPEN_CONFIRM_MODAL,
    CLOSE_CONFIRM_MODAL
} from './types';

import { errorDisplay, errorHide } from './error'

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
                throw new Error('Error fetching rooms');
            }
            dispatch(_roomsReceived(res.data));
        } catch (e) {
            dispatch(_roomsReceived([]));
            dispatch(errorDisplay({ 
                errorType: e.response.data.errorType, 
                errorMessage: e.response.data.errorMessage 
            }));
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
                throw new Error('Error deleting room');
            }
            dispatch(_roomDeleted(res.data.name));
            dispatch(closeConfirmModal());
        } catch (e) {
            dispatch(closeConfirmModal());
            dispatch(errorDisplay({ 
                errorType: e.response.data.errorType, 
                errorMessage: e.response.data.errorMessage 
            }));
        }
    };
}

export function confirmRoom(room) {
    return async (dispatch) => {
        try {
            const res = await apiCallWithData('post', 'rooms/join', { room });
            if (res.status !== 200) {
                throw new Error('Error confirming room');
            }
            dispatch(_roomChosen({ room: res.data }));
        } catch (e) {
            dispatch(errorDisplay({ 
                errorType: e.response.data.errorType, 
                errorMessage: e.response.data.errorMessage 
            }));
        }
    };
}

export function createRoom(data) {
    return async (dispatch) => {
        dispatch(errorHide());
        try {
            const res = await apiCallWithData('post', 'rooms', data);
            if (res.status !== 200) {
                throw new Error('Error confirming room');
            }
            dispatch(_roomCreated(res.data));
            dispatch(closeRoomModal());
        } catch (e) {
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

export function openConfirmModal(room) {
    return {
        type: OPEN_CONFIRM_MODAL,
        room
    }
}

export function closeConfirmModal() {
    return {
        type: CLOSE_CONFIRM_MODAL,
    }
}
