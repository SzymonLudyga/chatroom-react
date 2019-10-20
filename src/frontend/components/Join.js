import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button, IconButton, Fab, Typography
} from '@material-ui/core';

import DeleteIcon from "@material-ui/icons/Delete";

import { routes } from '../routing/routes';
import WebSocket from '../websockets/WebSocket';
import InputModal from '../common/InputModal';
import ConfirmModal from '../common/ConfirmModal';

export default class Join extends Component {
    constructor(props) {
        super(props);
        this._socket = new WebSocket();
    }

    componentDidMount() {
        this.props.fetchRooms();
    }

    _onRoomSubmit = (room) => {
        this.props.createRoom({
            user: this.props.username, room
        })
    }

    _handleSubmit = (room) => {
        this.props.confirmRoom(room);
        this.props.history.push(`${routes.chat}/${room}`);
    }

    _handleLogout = () => {
        this.props.logout({ username: this.props.username });
        this.props.history.push(routes.login);
    }

    render() {
        const { classes, rooms } = this.props;
        return (
            <>
                <div className={classes.container}>
                        <div className={classes.area}>
                            <Typography variant='h3'>Rooms</Typography>
                            {rooms.map(room => 
                                <div className={classes.textField}>
                                    <Fab className={classes.margin} variant="extended" onClick={() => this._handleSubmit(room.name)}>
                                        {room.name[0].toUpperCase() + room.name.substring(1)}
                                    </Fab>
                                    <IconButton className={classes.right} onClick={() => this.props.openConfirmModal(room.name)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                        <div className={classes.area}>
                            <Button onClick={this._handleSubmit} className={classes.big} variant="contained" color="primary">
                                Join
                            </Button>
                            <Button onClick={this._handleLogout} className={classes.big} variant="contained" color="secondary">
                                Log Out
                            </Button>
                            <Button onClick={this.props.openRoomModal} className={classes.big} variant="contained" color="secondary">
                                Add room
                            </Button>
                        </div>
                </div>
                <InputModal 
                    openModal={this.props.roomModal} 
                    closeModal={this.props.closeRoomModal} 
                    message="Type the name of the room"
                    onSubmit={(room) => this._onRoomSubmit(room)}
                    errorType={this.props.errorType}
                    errorMessage={this.props.errorMessage}
                />
                <ConfirmModal 
                    openModal={this.props.confirmModal} 
                    closeModal={this.props.closeConfirmModal}
                    message={`Do you want to delete room: ${this.props.confirmDeletedRoom}?`}
                    onSubmit={() => this.props.deleteRoom(this.props.confirmDeletedRoom)}
                    onCancel={this.props.closeConfirmModal}
                />
            </>
        );
    }
}


Join.propTypes = {
    rooms: PropTypes.array.isRequired,
    room: PropTypes.string,
    classes: PropTypes.object.isRequired,
    confirmRoom: PropTypes.func.isRequired,
    fetchRooms: PropTypes.func.isRequired,
};
