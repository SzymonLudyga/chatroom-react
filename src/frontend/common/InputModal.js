import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    TextField, Modal, Paper, Typography, Button, FormHelperText
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 400,
        padding: theme.spacing(3, 2),
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

function InputModal({
    openModal,
    closeModal,
    message,
    onSubmit,
    errorType,
    errorMessage
}) {
    const classes = useStyles();
    const [room, setRoom] = React.useState('');

    const handleChangeRoom = (e) => {
        setRoom(e.target.value);
    };

    const submit = () => {
        onSubmit(room);
        setRoom('');
    };

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
                    <TextField
                        className={classes.margin}
                        autoFocus
                        error={errorType === 'create-room'}
                        onChange={handleChangeRoom}
                        value={room}
                        placeholder="new room..."
                    />
                    {errorType === 'create-room'
                        && (
                            <FormHelperText className={classes.red}>
                                {errorMessage}
                            </FormHelperText>
                        )
                    }
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => submit()}
                >
                    Submit
                </Button>
            </Paper>
        </Modal>
    );
}

InputModal.propTypes = {
    message: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    errorType: PropTypes.string,
    errorMessage: PropTypes.string.isRequired,
};

export default InputModal;
