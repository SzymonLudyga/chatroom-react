import { ERROR_DISPLAY, ERROR_HIDE } from './types';

export function errorHide() {
    return {
        type: ERROR_HIDE,
    };
}

export function errorDisplay(error) {
    console.log(error);
    return {
        type: ERROR_DISPLAY,
        error
    };
}
