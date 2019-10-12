import { ERROR_DISPLAY, ERROR_HIDE } from '../actions/types';

const initialState = {
    errorType: null,
    errorMessage: ''
};

export default function error(state = initialState, action) {
    if (action.type === ERROR_DISPLAY) {
        console.log(action);
        return {
            ...state,
            errorType: action.error.errorType,
            errorMessage: action.error.errorMessage
        };
    }
    if (action.type === ERROR_HIDE) {
        return {
            ...state,
            errorType: null,
            errorMessage: ''
        };
    }
    return state;
}
