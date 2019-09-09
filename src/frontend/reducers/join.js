import { ROOMS_RECEIVED, ROOM_CHOSEN } from '../actions/types';

const initialState = {
    rooms: [],
    room: null,
};

export default function join(state = initialState, action) {
    if (action.type === ROOMS_RECEIVED) {
        return {
            ...state,
            rooms: action.rooms
        };
    }
    if (action.type === ROOM_CHOSEN) {
        return {
            ...state,
            room: action.room
        };
    }
    return state;
}
