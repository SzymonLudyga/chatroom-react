import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
    fetchMessages, clearMessages, deleteMessages, addMessage
} from '../actions/chat';
import { updateUserList } from '../actions/user';
import { errorDisplay, errorHide } from '../actions/error';

import Chat from '../components/Chat';

const styles = () => ({
    big: {
        fontSize: '40px'
    },
    marginBig: {
        margin: 30
    },
    red: {
        color: 'red'
    }
});

function mapStateToProps(state) {
    return {
        room: state.join.room,
        messages: state.chat.messages,
        username: state.user.userInfo.username,
        users: state.user.userList,
        errorType: state.error.errorType,
        errorMessage: state.error.errorMessage
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMessages: room => dispatch(fetchMessages(room)),
        addMessage: msg => dispatch(addMessage(msg)),
        clearMessages: () => dispatch(clearMessages()),
        deleteMessages: room => dispatch(deleteMessages(room)),
        handleError: error => dispatch(errorDisplay(error)),
        errorHide: () => dispatch(errorHide()),
        updateUserList: users => dispatch(updateUserList(users)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Chat));
