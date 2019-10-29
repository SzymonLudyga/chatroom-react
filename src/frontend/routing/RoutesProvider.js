import React from 'react';
import PropTypes from 'prop-types';

function RoutesProvider({ children }) {
    return <React.Fragment>{children}</React.Fragment>;
}

RoutesProvider.propTypes = {
    children: PropTypes.object.isRequired,
};

export default RoutesProvider;
