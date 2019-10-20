import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Modal, Paper, Typography, Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 400,
        padding: theme.spacing(3,2),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: theme.spacing(2, 2),
        padding: '10px 20px',
        fontSize: '20px'
    }
}));

export default function ConfirmModal({ 
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
                    <Button className={classes.button} variant="contained" color="primary" onClick={onSubmit}>
                        Yes
                    </Button>
                    <Button className={classes.button} variant="contained" color="secondary" onClick={onCancel}>
                        No
                    </Button>
                </div>
            </Paper>
        </Modal>
    );
}