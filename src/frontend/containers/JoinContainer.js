import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
    fetchRooms,
    confirmRoom,
    createRoom,
    deleteRoom,
    openRoomModal,
    closeRoomModal,
    openConfirmModal,
    closeConfirmModal
} from '../actions/join';
import { logout, refreshToken, clearUser } from '../actions/login';
import { errorHide } from '../actions/error';
import changePath from '../actions/status';

import Join from '../components/Join';

const styles = () => ({
    errorGrid: {
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    container: {
        marginTop: 10
    },
    room: {
        margin: 10,
        width: '100%'
    },
    buttonAdd: {
        margin: 10,
        fontSize: '20px',
        width: '100%',
    },
    topMargin: {
        top: 50
    },
    roomArea: {
        position: 'absolute',
        width: '30%',
        display: 'flex',
        left: 0,
        right: 0,
        margin: '0 auto',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minWidth: 260,
    },
    logout: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: '20%',
    },
    logoutSmall: {
        position: 'absolute',
        left: 0,
        right: 0,
        margin: '0 auto',
        width: '30%',
        minWidth: 260,
    },
    buttonLogout: {
        width: '100%'
    },
    roomList: {
        display: 'flex',
        justifyContent: 'space-between',
        minWidth: 260,
    },
    right: {
        margin: 10,
        marginLeft: 'auto'
    }
});

function mapStateToProps(state) {
    return {
        roomModal: state.join.roomModal,
        confirmDeletedRoom: state.join.confirmDeletedRoom,
        confirmModal: state.join.confirmModal,
        rooms: state.join.rooms,
        username: state.user.userInfo.username,
        errorType: state.error.errorType,
        errorMessage: state.error.errorMessage
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changePath: path => dispatch(changePath(path)),
        logout: username => dispatch(logout(username)),
        fetchRooms: () => dispatch(fetchRooms()),
        deleteRoom: room => dispatch(deleteRoom(room)),
        confirmRoom: room => dispatch(confirmRoom(room)),
        createRoom: data => dispatch(createRoom(data)),
        openRoomModal: () => dispatch(openRoomModal()),
        closeRoomModal: () => dispatch(closeRoomModal()),
        openConfirmModal: room => dispatch(openConfirmModal(room)),
        closeConfirmModal: () => dispatch(closeConfirmModal()),
        refreshToken: () => dispatch(refreshToken()),
        errorHide: () => dispatch(errorHide()),
        clearUser: () => dispatch(clearUser()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Join));
