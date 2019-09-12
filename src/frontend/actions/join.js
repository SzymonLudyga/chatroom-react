import { apiGetRooms, apiPostRoom } from '../api/api';
import { ROOMS_RECEIVED, ROOM_CHOSEN } from './types';

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
            const res = await apiGetRooms();
            if (res.status !== 200) {
                throw Error('Error fetching rooms');
            }
            dispatch(roomsReceived(res.data.rooms));
        } catch (e) {
            console.log(e);
        }
    };
}

export function leaveRoom() {
    return (dispatch) => {
        dispatch(roomChosen(null));
    };
}

export function confirmRoom(room) {
    return async (dispatch) => {
        try {
            const res = await apiPostRoom(room);
            if (res.status !== 200) {
                throw Error('Error adding room');
            }
            dispatch(roomChosen(res.data.room));
        } catch (e) {
            console.log(e);
        }
    };
}
