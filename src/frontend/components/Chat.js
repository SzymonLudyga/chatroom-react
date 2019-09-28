import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    FormControl, Button, Typography, InputLabel, Input, Divider, OutlinedInput
} from '@material-ui/core';
import { routes } from '../routing/routes';
import { baseUrl } from '../config/config';
import WebSocket from '../websockets/WebSocket';

export default class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageCount: 0,
            message: '',
        };

        this._socket = new WebSocket(baseUrl);
    }

    componentDidMount() {
        this.props.fetchMessages(this.props.room);
        this._socket.onMessage('new-message', () => {
            this.props.fetchMessages(this.props.room);
        });
        this._socket.onMessage('update-user-list', users => {
            this.props.updateUserList(users)
        });
    }

    _leaveRoom = () => {
        this._socket.emitMessage('leave-room', {
            user: this.props.username, room: this.props.room
        });
        // this.props.leaveRoom();
        this.props.history.push(routes.join);
    }

    _handleTypeChange = (e) => {
        this.setState({ message: e.target.value });
    }

    _sendMessage = () => {
        console.log(`${this.props.username} emits new message`);
        this._socket.emitMessage('create-message', {
            user: this.props.username,
            room: this.props.room,
            message: this.state.message
        });
        this.setState({ messageCount: this.state.messageCount + 1, message: '' });
    };

    render() {
        const { classes } = this.props;
        return (
            <>
                <FormControl>
                    <Typography className={classes.big}>
                        {`${this.props.username} in room ${this.props.room}`}
                    </Typography>
                    <Typography>
                        {`${this.state.messageCount} messages have been emitted`}
                    </Typography>
                    <Input onChange={this._handleTypeChange} placeholder="new message..." />
                    <Button onClick={this._sendMessage} variant="contained" color="primary">
                        Send
                    </Button>
                    <Button onClick={this.props.deleteMessages}>
                        Delete Messages
                    </Button>
                    <Button onClick={this._leaveRoom}>
                        Leave Room
                    </Button>
                </FormControl>
                {this.props.users.map(user => (
                    <>
                        <Divider />
                        <Typography variant='h3' key={user._id}>{`${user.name}`}</Typography>
                    </>
                ))}
                {this.props.messages.map(msg => (
                    <>
                        <Divider />
                        <Typography key={msg._id}>{`${msg.user} (${msg.timestamp}): ${msg.message}`}</Typography>
                    </>
                ))}
            </>
        );
    }
}


Chat.propTypes = {
    classes: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    deleteMessages: PropTypes.func.isRequired,
    leaveRoom: PropTypes.func.isRequired,
    fetchMessages: PropTypes.func.isRequired,
};
