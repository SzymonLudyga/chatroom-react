import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    FormControl, Button, InputLabel, Select, MenuItem, Input, FormHelperText
} from '@material-ui/core';
import { routes } from '../routing/routes';
import { baseUrl } from '../config/config';

import WebSocket from '../websockets/WebSocket';

export default class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomName: ''
        };

        this._socket = new WebSocket(baseUrl);
    }

    componentDidMount() {
        this.props.fetchRooms();
    }

    _handleChange = (e) => {
        this.setState({
            roomName: e.target.value
        });
    }

    _handleSubmit = () => {
        this._socket.emitMessage('join-room', {
            user: this.props.username, room: this.props.roomName
        });
        this.props.confirmRoom(this.state.roomName);
        this.props.history.push(routes.chat);
    }

    render() {
        const { classes, rooms } = this.props;
        return (
            <div className={classes.container}>
                <FormControl>
                    <InputLabel shrink htmlFor="room-label-placeholder">
                        Choose room
                    </InputLabel>
                    <Select
                        className={classes.textField}
                        value={this.state.roomName}
                        onChange={this._handleChange}
                        input={<Input name="room" id="room-helper" />}
                    >
                        {rooms.map(room => <MenuItem key={room.id} value={room.name}>{room.name[0].toUpperCase() + room.name.substring(1)}</MenuItem>)}
                    </Select>
                    <FormHelperText>Select room for chat</FormHelperText>
                    <Button onClick={this._handleSubmit} className={classes.big} variant="contained" color="primary">
                        Join
                    </Button>
                </FormControl>
            </div>

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
