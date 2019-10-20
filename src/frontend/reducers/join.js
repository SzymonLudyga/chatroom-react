import { 
    ROOMS_RECEIVED,
    ROOM_CHOSEN,
    ROOM_CREATED,
    ROOM_DELETED,
    CLOSE_ROOM_MODAL,
    OPEN_ROOM_MODAL
} from '../actions/types';

const initialState = {
    rooms: [],
    room: null,
    roomModal: false,
};

export default function join(state = initialState, action) {
    if (action.type === ROOMS_RECEIVED) {
        return {
            ...state,
            rooms: action.rooms
        };
    } if (action.type === ROOM_CHOSEN) {
        return {
            ...state,
            room: action.room
        };
    } if (action.type === OPEN_ROOM_MODAL) {
        return {
            ...state,
            roomModal: true
        };
    } if (action.type === CLOSE_ROOM_MODAL) {
        return {
            ...state,
            roomModal: false
        };
    } if (action.type === ROOM_CREATED) {
        return {
            ...state,
            rooms: state.rooms.concat([action.room])
        };
    } if (action.type === ROOM_DELETED) {
        return {
            ...state,
            rooms: state.rooms.filter(room => room.name !== action.room)
        };
    }
    return state;
}
