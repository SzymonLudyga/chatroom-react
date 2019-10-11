import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { fetchMessages, clearMessages, deleteMessages, addMessage } from '../actions/chat';
import { fetchCurrentRoom, leaveRoom } from '../actions/join';
import { updateUserList } from '../actions/user';

import Chat from '../components/Chat';

const styles = () => ({
    big: {
        fontSize: '40px'
    }
});

function mapStateToProps(state) {
    return {
        room: state.join.room,
        messages: state.chat.messages,
        username: state.user.userInfo.username,
        users: state.user.userList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCurrentRoom: () => dispatch(fetchCurrentRoom()),
        fetchMessages: (room) => dispatch(fetchMessages(room)),
        addMessage: (msg) => dispatch(addMessage(msg)),
        clearMessages: () => dispatch(clearMessages()),
        deleteMessages: (room) => dispatch(deleteMessages(room)),
        leaveRoom: () => dispatch(leaveRoom()),
        updateUserList: (users) => dispatch(updateUserList(users)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Chat));
