import * as React from 'react';

export default class RoutesProvider extends React.Component {
    render() {
        const { children } = this.props;
        return <React.Fragment>{children}</React.Fragment>;
    }
}
