
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store, { history } from './store/index';
import Routes from './routing/AppRoutes';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist';

require('moment').locale('pl');

export default class App extends Component {
    render() {
        let persistor = persistStore(store);
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
