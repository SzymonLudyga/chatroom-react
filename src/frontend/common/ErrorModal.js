import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Modal, Paper, Typography, Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 400,
        padding: theme.spacing(2, 3),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    message: {
        textAlign: 'center',
        fontSize: 30,
        margin: 10
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        fontSize: 20,
        padding: theme.spacing(1, 3),
        margin: 10
    }
}));

function ErrorModal({
    message,
    onSubmit
}) {
    const classes = useStyles();
    return (
        <Modal
            className={classes.center}
            open={message}
        >
            <Paper className={classes.root}>
                <Typography
                    className={classes.message}
                    variant="h5"
                    component="h3"
                >
                    {message}
                </Typography>
                <div>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        onClick={onSubmit}
                    >
                        OK
                    </Button>
                </div>
            </Paper>
        </Modal>
    );
}

ErrorModal.propTypes = {
    message: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ErrorModal;
