/* eslint "max-len": ["error", { "code": 100, "tabWidth": 4 }] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button, Typography, TextField, FormHelperText, Grid
} from '@material-ui/core';
import _ from 'lodash';
import moment from 'moment';
import classnames from 'classnames';
import routes from '../routing/routes';
import WebSocket from '../websockets/WebSocket';
import ErrorModal from '../common/ErrorModal';

const throttled = method => _.throttle(method, { trailing: true, leading: true });

export default class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageCount: 0,
            message: '',
            /* eslint-disable-next-line react/destructuring-assignment */
            roomName: this.props.match.params.room,
            screenWidth: window.innerWidth,
        };

        this.throttledRefreshToken = throttled(props.refreshToken);

        this._socket = new WebSocket();
    }

    componentDidMount() {
        const {
            addMessage,
            handleError,
            updateUserList,
            username
        } = this.props;
        const { roomName } = this.state;
        this._socket.onMessage('new-message', (res) => {
            addMessage(res);
            this._scrollToBottom();
        });
        this._socket.onMessage('error-message', (res) => {
            handleError({ errorType: res.type, errorMessage: res.message });
        });
        this._socket.onMessage('update-user-list', (users) => {
            updateUserList(users);
        });
        this._socket.emitMessage('join-room', {
            user: username, room: roomName
        });
        this._scrollToBottom();
        window.addEventListener('resize', () => this._handleResize());
        setInterval(() => this.throttledRefreshToken(), 15 * 60 * 1000);
    }

    componentWillUnmount() {
        const { clearMessages } = this.props;
        clearMessages();
        this._socket.close();
        window.removeEventListener('resize', this._handleResize);
    }

    _handleResize = () => {
        this.setState({
            screenWidth: window.innerWidth
        });
    }

    _scrollToBottom = () => {
        this.messagesEnd.scrollIntoView();
    }

    _delete = () => {
        const { deleteMessages } = this.props;
        const { roomName } = this.state;
        deleteMessages(roomName);
    }

    _getPastMessages = () => {
        const { fetchMessages } = this.props;
        const { roomName } = this.state;
        fetchMessages(roomName);
    }

    _leaveRoom = () => {
        const { username, history } = this.props;
        const { roomName } = this.state;
        this._socket.emitMessage('leave-room', {
            user: username, room: roomName
        });
        history.push(routes.join);
    }

    _onEnter = (e) => {
        if (e.keyCode === 13) {
            this._sendMessage();
        }
    }

    _handleTypeChange = (e) => {
        this.setState({ message: e.target.value });
    }

    _renderProperTime = timestamp => (
        moment().format('DDMMYYYY') === moment(timestamp).format('DDMMYYYY')
            ? moment(timestamp).format('H:mm') : moment(timestamp).format('DD.MM')
    )

    _sendMessage = () => {
        const { roomName, message, messageCount } = this.state;
        const { username, errorHide } = this.props;
        console.log(
            `${username} 
            emits new message 
            ${message} 
            to ${roomName}`
        );

        errorHide();
        this._socket.emitMessage('create-message', {
            user: username,
            room: roomName,
            message
        });
        this.setState({ messageCount: messageCount + 1, message: '' });
    };

    render() {
        const {
            classes, errorMessage, errorType, messages, username, users, errorHide
        } = this.props;
        const { messageCount, message, screenWidth } = this.state;
        const isSmallerScreen = screenWidth < 700;
        return (
            <>
                <Grid className={classes.container}>
                    <div className={isSmallerScreen ? classes.usersNone : classes.users}>
                        <div>
                            <Typography
                                key={1}
                                className={classes.userTitle}
                                variant="h3"
                            >
                                Users
                            </Typography>
                            {users.map(user => (
                                <Typography
                                    className={classes.userElement}
                                    variant="h5"
                                    key={user._id}
                                >
                                    {user.name}
                                </Typography>
                            ))}
                        </div>
                        <div className={classes.buttonDiv}>
                            <Button className={classes.white} onClick={this._delete}>
                                Delete Messages
                            </Button>

                            <Button className={classes.white} onClick={this._getPastMessages}>
                                Get messages history
                            </Button>
                        </div>
                    </div>

                    <div className={classes.messages}>
                        <div className={classes.msg}>
                            <Button
                                variant="outlined"
                                className={isSmallerScreen
                                    ? classes.buttonLeaveSmall
                                    : classes.buttonLeave}
                                color="secondary"
                                onClick={this._leaveRoom}
                            >
                                Leave room
                            </Button>
                            <div
                                className={isSmallerScreen
                                    ? classes.whiteDivSmall
                                    : classes.whiteDiv}
                            />
                            <Typography key={2} className={classes.big}>
                                {`Welcome ${username}!`}
                            </Typography>
                            <Typography key={3}>
                                {`${messageCount} messages have been emitted`}
                            </Typography>
                            {messages.map(msg => (
                                msg.user === 'Admin'
                                    ? (
                                        <Typography className={classes.adminMessage}>
                                            {msg.message}
                                        </Typography>
                                    )
                                    : (
                                        <div
                                            className={classnames([
                                                classes.messageBox,
                                                username === msg.user
                                                    ? classes.coloredBox
                                                    : classes.plainBox
                                            ])}
                                            key={msg._id}
                                        >
                                            <Typography className={classes.timestamp}>
                                                {this._renderProperTime(msg.timestamp)}
                                            </Typography>
                                            <Typography className={classes.singleMessage}>
                                                {`${msg.user}: ${msg.message}`}
                                            </Typography>
                                        </div>
                                    )
                            ))}
                            <div
                                className={classes.dummyDiv}
                                ref={(el) => { this.messagesEnd = el; }}
                            />
                        </div>
                        <div className={classes.inputWithButton}>
                            <div className={classes.inputWithHelper}>
                                <TextField
                                    autoFocus
                                    error={errorType === 'send-message-error'}
                                    onKeyDown={this._onEnter}
                                    onChange={this._handleTypeChange}
                                    value={message}
                                    placeholder="new message..."
                                />
                                {errorType === 'send-message-error'
                                    && (
                                        <FormHelperText
                                            className={classes.red}
                                        >
                                            {errorMessage}
                                        </FormHelperText>
                                    )
                                }
                            </div>
                            <Button
                                className={classes.send}
                                onClick={this._sendMessage}
                                variant="contained"
                                color="primary"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </Grid>
                {(errorType === 'user-error'
                    || errorType === 'message-error'
                    || errorType === 'token')
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


Chat.propTypes = {
    users: PropTypes.array.isRequired,
    errorType: PropTypes.string,
    errorMessage: PropTypes.string.isRequired,
    errorHide: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    fetchMessages: PropTypes.func.isRequired,
    deleteMessages: PropTypes.func.isRequired,
    clearMessages: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    updateUserList: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired,
    refreshToken: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
};
