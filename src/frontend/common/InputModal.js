import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    TextField, Modal, Paper, Typography, Button, FormHelperText
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
    marginBig: {
        margin: theme.spacing(6, 2),
    }, 
    red: {
        color: 'red'
    }
}));

export default function InputModal({ 
    openModal, 
    closeModal, 
    message, 
    onSubmit, 
    errorType, 
    errorMessage 
}) {
    const classes = useStyles();
    const [room, setRoom] = React.useState('');

    const handleChangeRoom = e => {
        setRoom(e.target.value);
    }

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
                <div className={classes.marginBig}>
                <TextField className={classes.margin} autoFocus
                    error={errorType === 'create-room'} 
                    onChange={handleChangeRoom} value={room} 
                    placeholder="new room..." />
                    {errorType === 'create-room' && 
                        <FormHelperText className={classes.red}>{errorMessage}</FormHelperText>
                    }
                </div>
                <Button variant="contained" color="primary" onClick={()=>onSubmit(room)}>
                    Submit
                </Button>
            </Paper>
        </Modal>
    );
}
