import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from '../reducers/rootReducer';

export const history = createHashHistory();

const store = createStore(
    createRootReducer(history),
    composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
);

export default store;
