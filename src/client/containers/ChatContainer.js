import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Chat from '../components/Chat';

const styles = () => ({
    big: {
        fontSize: '40px'
    }
});

function mapStateToProps(state) {
    return {
        room: state.join.room,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Chat));
