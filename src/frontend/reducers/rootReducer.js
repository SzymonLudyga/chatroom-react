import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import join from './join';
import chat from './chat';
import user from './user';
import error from './error';

export default function createRootReducer(history) {
    return combineReducers({
        router: connectRouter(history),
        join,
        chat,
        user,
        error
    });
}
