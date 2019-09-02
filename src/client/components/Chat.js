import React, { useState, useEffect } from 'react';

import {
    FormControl, Button, Typography, InputLabel, Input, Divider, OutlinedInput
} from '@material-ui/core';
import axios from 'axios';

const io = require('socket.io-client');

const socket = io('http://localhost:3030');

function Chat() {
    const [username, setUsername] = useState('USER');
    const [messageCount, setMessageCount] = useState(0);
    const [inRoom, setInRoom] = useState(false);

    useEffect(() => {
        if (inRoom) {
            socket.emit('room', { room: 'test-room' });
        }

        return () => {
            if (inRoom) {
                console.log('leaving room');
                socket.emit('leave room', {
                    room: 'test-room'
                });
            }
        };
    });

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                'http://localhost:3030/api/getUsername',
            );

            setUsername(result);
        };
        fetchData();
    }, []);

    useEffect(() => {
        socket.on('receive message', (payload) => {
            setMessageCount(messageCount + 1);
        });

        document.title = `${messageCount} new messages have been emitted`;
    }, [messageCount]); // only re-run the effect if new message comes in

    const handleInRoom = () => {
        inRoom
            ? setInRoom(false)
            : setInRoom(true);
    };

    const handleNewMessage = () => {
        console.log(`${username.data.username} emits new message`);
        socket.emit('new message', {
            room: 'test-room'
        });
        setMessageCount(messageCount + 1);
    };

    return (
        <>
            <FormControl>
                <h1>
                    {inRoom && 'You Have Entered The Room'}
                    {!inRoom && 'Outside Room'}
                </h1>
                <p>
                    {messageCount}
                    {' '}
messages have been emitted
                </p>
                {/* <InputLabel htmlFor="component-outlined">
                    Name
                </InputLabel> */}
                {/* <OutlinedInput
                    id="component-outlined"
                    value={name}
                    onChange={this.handleChange}
                /> */}
                <Button onClick={() => handleNewMessage()} variant="contained" color="primary">
                    Emit
                </Button>
                <Button onClick={() => handleInRoom()}>
                    {inRoom ? 'Leave Room' : 'Enter room'}
                </Button>
            </FormControl>
        </>
    );
}

export default Chat;
