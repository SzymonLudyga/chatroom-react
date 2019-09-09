import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Login from '../components/Login';

const styles = theme => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    big: {
        marginTop: '20px',
        fontSize: '30px',
        width: '40%',
    },
    textField: {
        width: '50%',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
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
)(withStyles(styles)(Login));
