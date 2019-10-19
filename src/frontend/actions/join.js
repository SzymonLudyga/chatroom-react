import { apiCall, apiCallWithData } from '../api/api';
import { ROOMS_RECEIVED, ROOM_CHOSEN, ROOM_CREATED } from './types';
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
            dispatch(_roomCreated(res.data.name));
        } catch (e) {
            console.log(e.response);
            if (e.response.status === 400) {
                dispatch(errorDisplay({ 
                    errorType: e.response.data.errorType, 
                    errorMessage: e.response.data.errorMessage 
                }));
            }
        }
    };
}
