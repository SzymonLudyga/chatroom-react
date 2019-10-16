import { apiCall, apiCallWithData } from '../api/api';
import { ROOMS_RECEIVED, ROOM_CHOSEN } from './types';
import { errorDisplay } from './error'

function roomsReceived(rooms) {
    return {
        type: ROOMS_RECEIVED,
        rooms,
    };
}

function roomChosen(room) {
    return {
        type: ROOM_CHOSEN,
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
            dispatch(roomsReceived(res.data));
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
            dispatch(roomChosen(res.data.room));
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
            // dispatch(roomCreated(res.data.room));
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
