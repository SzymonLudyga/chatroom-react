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
        textAlign: 'center',
        flexDirection: 'column',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: 10
    }
}));

function ConfirmModal({
    openModal,
    closeModal,
    message,
    onCancel,
    onSubmit
}) {
    const classes = useStyles();
    return (
        <Modal
            className={classes.center}
            open={openModal}
            onClose={closeModal}
        >
            <Paper className={classes.root}>
                <Typography variant="h5" component="h3">
                    {message}
                </Typography>
                <div>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        onClick={onSubmit}
                    >
                        Yes
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={onCancel}
                    >
                        No
                    </Button>
                </div>
            </Paper>
        </Modal>
    );
}

ConfirmModal.propTypes = {
    message: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ConfirmModal;
