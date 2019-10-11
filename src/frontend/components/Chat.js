import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    FormControl, Button, Typography, InputLabel, Input, Divider, OutlinedInput
} from '@material-ui/core';
import { routes } from '../routing/routes';
import WebSocket from '../websockets/WebSocket';

export default class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageCount: 0,
            message: '',
            roomName: this.props.match.params.room,
        };

        this._socket = new WebSocket();
    }

    componentDidMount() {
        this._socket.onMessage('new-message', (res) => {
            this.props.addMessage(res)
        });
        this._socket.onMessage('update-user-list', users => {
            console.log(users);
            this.props.updateUserList(users)
        });
        this._socket.emitMessage('join-room', {
            user: this.props.username, room: this.state.roomName
        });
    }

    componentWillUnmount() {
        this.props.clearMessages();
    }

    _delete = () => {
        this.props.deleteMessages(this.state.roomName);
        this.props.clearMessages();
    }

    _getPastMessages = () => {
        this.props.fetchMessages(this.state.roomName);
    }

    _leaveRoom = () => {
        this._socket.emitMessage('leave-room', {
            user: this.props.username, room: this.state.roomName
        });
        this.props.history.push(routes.join);
    }

    _handleTypeChange = (e) => {
        this.setState({ message: e.target.value });
    }

    _sendMessage = () => {
        console.log(`${this.props.username} emits new message ${this.state.message} to ${this.state.roomName}`);

        this._socket.emitMessage('create-message', {
            user: this.props.username,
            room: this.state.roomName,
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
                        {`${this.props.username} in room ${this.state.roomName}`}
                    </Typography>
                    <Typography>
                        {`${this.state.messageCount} messages have been emitted`}
                    </Typography>
                    <Input onChange={this._handleTypeChange} value={this.state.message} placeholder="new message..." />
                    <Button onClick={this._sendMessage} variant="contained" color="primary">
                        Send
                    </Button>
                    <Button onClick={this._delete}>
                        Delete Messages
                    </Button>
                    <Button onClick={this._leaveRoom}>
                        Leave Room
                    </Button>

                    <Button onClick={this._getPastMessages}>
                        Get messages from the past
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
                        <Typography key={msg.timestamp}>{`${msg.user} (${msg.timestamp}): ${msg.message}`}</Typography>
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
