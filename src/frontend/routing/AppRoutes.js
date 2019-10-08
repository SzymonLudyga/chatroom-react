import React from 'react';
import { Switch, Route } from 'react-router';
import { routes } from './routes';
import RoutesProvider from './RoutesProvider';
import HomeContainer from '../containers/HomeContainer';
import ChatContainer from '../containers/ChatContainer';
import LoginContainer from '../containers/LoginContainer';
import JoinContainer from '../containers/JoinContainer';

export default () => (
    <RoutesProvider>
        <Switch>
            <Route exact path={routes.homepage} component={HomeContainer} />
            <Route exact path={routes.chatroom} component={ChatContainer} />
            <Route exact path={routes.join} component={JoinContainer} />
            <Route component={LoginContainer} />
        </Switch>
    </RoutesProvider>
);
