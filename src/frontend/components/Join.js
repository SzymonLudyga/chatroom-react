import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button, InputLabel, Select, MenuItem, Input, FormHelperText, IconButton
} from '@material-ui/core';

import DeleteIcon from "@material-ui/icons/Delete";

import { routes } from '../routing/routes';
import WebSocket from '../websockets/WebSocket';
import InputModal from '../common/InputModal';

export default class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomName: '',
        };

        this._socket = new WebSocket();
    }

    componentDidMount() {
        this.props.fetchRooms();
    }

    _handleChange = (e) => {
        this.setState({
            roomName: e.target.value
        });
    }

    _openModal = () => {
        this.props.openRoomModal();
    }

    _closeModal = () => {
        this.props.closeRoomModal();
    }

    _onRoomSubmit = (room) => {
        this.props.createRoom({
            user: this.props.username, room
        })
    }

    _handleSubmit = () => {
        this.props.confirmRoom(this.state.roomName);
        this.props.history.push(`${routes.chat}/${this.state.roomName}`);
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
                            <InputLabel shrink htmlFor="room-label-placeholder">
                                Choose room
                            </InputLabel>
                            <Select
                                className={classes.textField}
                                value={this.state.roomName}
                                onChange={this._handleChange}
                                input={<Input name="room" id="room-helper" />}
                            >
                                {rooms.map(room => <MenuItem key={room._id} value={room.name}>{room.name[0].toUpperCase() + room.name.substring(1)}<IconButton className={classes.right}><DeleteIcon /></IconButton></MenuItem>)}
                            </Select>
                            <FormHelperText>Select room for chat</FormHelperText>
                        </div>
                        <div className={classes.area}>
                            <Button onClick={this._handleSubmit} className={classes.big} variant="contained" color="primary">
                                Join
                            </Button>
                            <Button onClick={this._handleLogout} className={classes.big} variant="contained" color="secondary">
                                Log Out
                            </Button>
                            <Button onClick={this._openModal} className={classes.big} variant="contained" color="secondary">
                                Add room
                            </Button>
                        </div>
                </div>
                <InputModal 
                    openModal={this.props.roomModal} 
                    closeModal={this._closeModal} 
                    message="Type the name of the room"
                    onSubmit={(room) => this._onRoomSubmit(room)}
                    errorType={this.props.errorType}
                    errorMessage={this.props.errorMessage}
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
