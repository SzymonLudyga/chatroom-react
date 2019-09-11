import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { fetchMessages, deleteMessages } from '../actions/chat';
import { fetchCurrentRoom } from '../actions/join';

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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCurrentRoom: () => dispatch(fetchCurrentRoom()),
        fetchMessages: () => dispatch(fetchMessages()),
        deleteMessages: () => dispatch(deleteMessages()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Chat));
