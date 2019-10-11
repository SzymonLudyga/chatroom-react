import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { fetchRooms, confirmRoom } from '../actions/join';
import { logout } from '../actions/login';

import Join from '../components/Join';

const styles = theme => ({
    container: {
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 120,
    },
    big: {
        marginTop: '20px',
        fontSize: '20px',
        width: '100%',
    },
    textField: {
        minWidth: 160,
    }
});

function mapStateToProps(state) {
    return {
        rooms: state.join.rooms,
        username: state.user.userInfo.username,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: (username) => dispatch(logout(username)),
        fetchRooms: () => dispatch(fetchRooms()),
        confirmRoom: room => dispatch(confirmRoom(room)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Join));
