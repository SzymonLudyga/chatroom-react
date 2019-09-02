import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

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
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Join));
