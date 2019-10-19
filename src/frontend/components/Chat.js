import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Button, Typography, TextField, FormHelperText, Divider, Grid
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
            this.props.addMessage(res);
            this._scrollToBottom();
        });
        this._socket.onMessage('error-message', (res) => {
            this.props.handleError({ errorType: res.type, errorMessage: res.message });
        });
        this._socket.onMessage('update-user-list', (users) => {
            this.props.updateUserList(users);
        });
        this._socket.emitMessage('join-room', {
            user: this.props.username, room: this.state.roomName
        });
        this._scrollToBottom();
    }

    componentWillUnmount() {
        this.props.clearMessages();
    }

    _scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
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

    _onEnter = e => {
        console.log(e);
        if(e.keyCode == 13){
            this._sendMessage();
        }
    }

    _handleTypeChange = (e) => {
        this.setState({ message: e.target.value });
    }

    _sendMessage = () => {
        console.log(`${this.props.username} emits new message ${this.state.message} to ${this.state.roomName}`);

        this.props.errorHide();
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
            <Grid className={classes.container}>
                <div className={classes.users}>
                    <div>
                        <Typography className={classes.userTitle} variant="h3" key={1}>Users</Typography>
                        {this.props.users.map(user => (
                            <Typography className={classes.userElement} variant="h5" key={user._id}>- {user.name}</Typography>
                        ))}
                    </div>
                    <div className={classes.buttonDiv}>
                        <Button className={classes.white} onClick={this._delete}>
                            Delete Messages
                        </Button>
                        <Button className={classes.white} onClick={this._leaveRoom}>
                            Leave Room
                        </Button>

                        <Button className={classes.white} onClick={this._getPastMessages}>
                            Get messages history
                        </Button>
                    </div>
                </div>

                <div className={classes.messages}>
                    <div className={classes.msg}>
                        <Typography className={classes.big}>
                            {`${this.props.username} in room ${this.state.roomName}`}
                        </Typography>
                        <Typography>
                            {`${this.state.messageCount} messages have been emitted`}
                        </Typography>
                        {this.props.messages.map(msg => 
                            <Typography className={classes.singleMessage} key={msg.timestamp}>{`${msg.user} (${msg.timestamp}): ${msg.message}`}</Typography>
                        )}
                        <div className={classes.dummyDiv}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className={classes.inputWithButton}>
                        <div className={classes.inputWithHelper}>
                            <TextField autoFocus error={this.props.errorType === 'message'} onKeyDown={this._onEnter} onChange={this._handleTypeChange} value={this.state.message} placeholder="new message..." />
                            {this.props.errorType === 'message'
                                && <FormHelperText className={classes.red}>{this.props.errorMessage}</FormHelperText>
                            }
                        </div>
                        <Button className={classes.send} onClick={this._sendMessage} variant="contained" color="primary">
                            Send
                        </Button>
                    </div>
                </div>
            </Grid>
        );
    }
}


Chat.propTypes = {
    classes: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    deleteMessages: PropTypes.func.isRequired,
    fetchMessages: PropTypes.func.isRequired,
};
