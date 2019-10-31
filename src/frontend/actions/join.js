import { apiCall, authApiCallWithData } from '../api/api';
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
import { errorDisplay, errorHide } from './error';
import changePath from './status';
import routes from '../routing/routes';

export function openRoomModal() {
    return {
        type: OPEN_ROOM_MODAL,
    };
}

export function closeRoomModal() {
    return {
        type: CLOSE_ROOM_MODAL,
    };
}

export function openConfirmModal(room) {
    return {
        type: OPEN_CONFIRM_MODAL,
        room
    };
}

export function closeConfirmModal() {
    return {
        type: CLOSE_CONFIRM_MODAL,
    };
}


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
    return async (dispatch, getState) => {
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            const res = await authApiCallWithData(
                'delete',
                'rooms',
                tokenInfo,
                { room }
            );
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
    return async (dispatch, getState) => {
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            const res = await authApiCallWithData(
                'post',
                'rooms/join',
                tokenInfo,
                { room }
            );
            dispatch(_roomChosen({ room: res.data.room }));
            dispatch(changePath({ path: `${routes.chat}/${room}` }));
        } catch (e) {
            dispatch(errorDisplay({
                errorType: e.response.data.errorType,
                errorMessage: e.response.data.errorMessage
            }));
        }
    };
}

export function createRoom(data) {
    return async (dispatch, getState) => {
        dispatch(errorHide());
        try {
            const { tokenInfo } = getState().user.userInfo.token;
            const res = await authApiCallWithData(
                'post',
                'rooms',
                tokenInfo,
                data
            );
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
