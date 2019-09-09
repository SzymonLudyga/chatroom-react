import React, { Component } from 'react';

import {
    FormControl, Button, Typography, InputLabel, Input, Divider, OutlinedInput
} from '@material-ui/core';
import axios from 'axios';

const io = require('socket.io-client');

const socket = io('http://localhost:8080');

export default class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: 'USER',
            messageCount: 0,
            inRoom: false
        };
    }

    async componentDidMount() {
        const res = await axios(
            'http://localhost:8080/api/username',
        );
        this.setState({ username: res.data.username });
    }

    _handleInRoom = () => {
        if (this.state.inRoom) {
            socket.emit('leave room', {
                room: 'test-room'
            });
            this.setState({ inRoom: false });
        } else {
            socket.emit('room', { room: 'test-room' });
            this.setState({ inRoom: true });
        }
    };

    _handleNewMessage = () => {
        console.log(`${this.state.username} emits new message`);
        socket.emit('new message', {
            room: this.props.room
        });
        if (this.state.inRoom) {
            this.setState({ messageCount: this.state.messageCount + 1 });
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <>
                <FormControl>
                    <Typography className={classes.big}>
                        {this.state.inRoom && 'You Have Entered The Room'}
                        {!this.state.inRoom && 'Outside Room'}
                    </Typography>
                    <Typography>
                        {`${this.state.messageCount} messages have been emitted`}
                    </Typography>
                    <Typography htmlFor="component-outlined">
                        {`${this.state.username} in room ${this.props.room}`}
                    </Typography>
                    {/* <OutlinedInput
                        id="component-outlined"
                        value={name}
                        onChange={this._handleChange}
                    /> */}
                    <Button onClick={this._handleNewMessage} variant="contained" color="primary">
                        Emit
                    </Button>
                    <Button onClick={this._handleInRoom}>
                        {this.state.inRoom ? 'Leave Room' : 'Enter room'}
                    </Button>
                </FormControl>
            </>
        );
    }
}
