
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store, { history } from './store/index';
import Routes from './routing/AppRoutes';
import _ from 'lodash';
import { refreshToken } from './actions/login'

require('moment').locale('pl');

const throttled = _.throttle(refreshToken(store));

export default class App extends Component {
    componentWillMount() {
        setInterval(() => throttled(), 15*60*1000);
    }

    render() {
        const persistor = persistStore(store);
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ConnectedRouter history={history}>
                        <Routes />
                    </ConnectedRouter>
                </PersistGate>
            </Provider>
        );
    }
}
