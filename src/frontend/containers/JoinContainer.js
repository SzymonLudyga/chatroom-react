import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { fetchRooms, confirmRoom, createRoom } from '../actions/join';
import { logout } from '../actions/login';

import Join from '../components/Join';

const styles = theme => ({
    container: {
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        minWidth: 120,
    },
    big: {
        margin: '10px',
        fontSize: '20px',
        width: '100%',
    },
    area: {
        margin: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minWidth: 260,
        border: '3px solid black',
    },
    textField: {
        minWidth: 260,
    }
});

function mapStateToProps(state) {
    return {
        rooms: state.join.rooms,
        username: state.user.userInfo.username,
        errorType: state.error.errorType,
        errorMessage: state.error.errorMessage
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: username => dispatch(logout(username)),
        fetchRooms: () => dispatch(fetchRooms()),
        confirmRoom: room => dispatch(confirmRoom(room)),
        createRoom: data => dispatch(createRoom(data)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Join));
