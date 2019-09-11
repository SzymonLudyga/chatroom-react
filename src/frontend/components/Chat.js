import React, { Component } from 'react';

import {
    FormControl, Button, Typography, InputLabel, Input, Divider, OutlinedInput
} from '@material-ui/core';

const io = require('socket.io-client');

const socket = io('http://localhost:8080');

export default class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: 'USER',
            messageCount: 0,
            inRoom: false,
            message: '',
        };
    }

    componentDidMount() {
        console.log(this.props.room);
        this.props.fetchCurrentRoom();
        socket.on('new-message', () => {
            this.props.fetchMessages();
        });
        this.setState({ username: 'Szymon' });
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

    _handleTypeChange = (e) => {
        this.setState({ message: e.target.value });
    }

    _handleEmitMessage = () => {
        console.log(`${this.state.username} emits new message`);
        socket.emit('create-message', {
            name: this.state.username,
            room: this.props.room,
            message: this.state.message
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
                    <Input onChange={this._handleTypeChange} placeholder="new message..." />
                    <Button onClick={this._handleEmitMessage} variant="contained" color="primary">
                        Emit
                    </Button>
                    <Button onClick={this._handleInRoom}>
                        {this.state.inRoom ? 'Leave Room' : 'Enter room'}
                    </Button>
                    <Button onClick={this.props.deleteMessages}>
                        Delete Messages
                    </Button>
                    {this.props.messages.map(message => (
                        <>
                            <Divider />
                            <Typography>{`${message.from} (${message.createdAt}): ${message.text}`}</Typography>
                        </>
                    ))}
                </FormControl>
            </>
        );
    }
}
