import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { fetchRooms, confirmRoom, createRoom, openRoomModal, closeRoomModal } from '../actions/join';
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
    },
    right: {
        marginLeft: 'auto'
    }
});

function mapStateToProps(state) {
    return {
        roomModal: state.join.roomModal,
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
        openRoomModal: () => dispatch(openRoomModal()),
        closeRoomModal: () => dispatch(closeRoomModal())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Join));
