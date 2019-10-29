/* eslint "max-len": ["error", { "code": 100, "tabWidth": 4 }] */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button, IconButton, Fab, Typography
} from '@material-ui/core';
import classnames from 'classnames';
import DeleteIcon from '@material-ui/icons/Delete';

import _ from 'lodash';
import routes from '../routing/routes';
import WebSocket from '../websockets/WebSocket';
import InputModal from '../common/InputModal';
import ConfirmModal from '../common/ConfirmModal';
import ErrorModal from '../common/ErrorModal';

const throttled = method => _.throttle(method, { trailing: true, leading: true });

export default class Join extends Component {
    constructor(props) {
        super(props);

        this.state = {
            screenWidth: window.innerWidth,
        };

        this.throttledRefreshToken = throttled(props.refreshToken);

        this._socket = new WebSocket();
    }

    componentDidMount() {
        const { fetchRooms } = this.props;
        fetchRooms();
        window.addEventListener('resize', () => this._handleResize());
        setInterval(() => this.throttledRefreshToken(), 15 * 60 * 1000);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._handleResize);
    }

    _handleResize = () => {
        this.setState({
            screenWidth: window.innerWidth
        });
    }

    _onRoomSubmit = (room) => {
        const { createRoom, username } = this.props;
        createRoom({
            user: username, room
        });
    }

    _handleSubmit = (room) => {
        const { confirmRoom, history } = this.props;
        confirmRoom(room);
        history.push(`${routes.chat}/${room}`);
    }

    _handleLogout = () => {
        const { logout, history, username } = this.props;
        logout({ username });
        history.push(routes.login);
    }

    render() {
        const {
            classes,
            rooms,
            confirmDeletedRoom,
            openConfirmModal,
            openRoomModal,
            roomModal,
            closeRoomModal,
            errorType,
            errorMessage,
            closeConfirmModal,
            confirmModal,
            deleteRoom,
            errorHide,
        } = this.props;
        const { screenWidth } = this.state;
        const isSmallerScreen = screenWidth < 600;
        return (
            <>
                <div className={classes.container}>
                    <div className={classnames([
                        classes.roomArea,
                        isSmallerScreen && classes.topMargin
                    ])}
                    >
                        <Typography key={1} variant="h3">Join Room</Typography>
                        {rooms.map(room => (
                            <div className={classes.roomList}>
                                <Fab
                                    key={room.name}
                                    className={classes.room}
                                    variant="extended"
                                    onClick={
                                        () => this._handleSubmit(room.name)
                                    }
                                >
                                    {room.name[0].toUpperCase() + room.name.substring(1)}
                                </Fab>
                                <IconButton
                                    className={classes.right}
                                    onClick={
                                        () => openConfirmModal(room.name)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))}
                        <Button
                            onClick={openRoomModal}
                            className={classes.buttonAdd}
                            variant="contained"
                            color="primary"
                        >
                            Add room
                        </Button>
                    </div>
                    <div className={isSmallerScreen ? classes.logoutSmall : classes.logout}>
                        <Button
                            onClick={this._handleLogout}
                            className={classes.buttonLogout}
                            variant="outlined"
                            color="secondary"
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
                <InputModal
                    openModal={roomModal}
                    closeModal={closeRoomModal}
                    message="Type the name of the room"
                    onSubmit={room => this._onRoomSubmit(room)}
                    errorType={errorType}
                    errorMessage={errorMessage}
                />
                <ConfirmModal
                    openModal={confirmModal}
                    closeModal={closeConfirmModal}
                    message={`Do you want to delete room: ${confirmDeletedRoom}?`}
                    onSubmit={() => deleteRoom(confirmDeletedRoom)}
                    onCancel={closeConfirmModal}
                />
                {(errorType === 'room-error' || errorType === 'token')
                    && (
                        <ErrorModal
                            message={errorMessage}
                            onSubmit={errorHide}
                        />
                    )}
            </>
        );
    }
}


Join.propTypes = {
    rooms: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    confirmRoom: PropTypes.func.isRequired,
    fetchRooms: PropTypes.func.isRequired,
    errorHide: PropTypes.func.isRequired,
    closeConfirmModal: PropTypes.func.isRequired,
    deleteRoom: PropTypes.func.isRequired,
    confirmModal: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    roomModal: PropTypes.bool.isRequired,
    errorType: PropTypes.string,
    errorMessage: PropTypes.string.isRequired,
    confirmDeletedRoom: PropTypes.string,
    closeRoomModal: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    createRoom: PropTypes.func.isRequired,
    refreshToken: PropTypes.func.isRequired,
    openRoomModal: PropTypes.func.isRequired,
    openConfirmModal: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired
};
