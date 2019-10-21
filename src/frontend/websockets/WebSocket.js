const io = require('socket.io-client');

export default class WebSocket {
    constructor() {
        this.socket = io('http://localhost:3000');
    }

    onMessage = (query, data = null) => {
        this.socket.on(query, data);
    }

    emitMessage = (query, data = null) => {
        this.socket.emit(query, data);
    }

    close = () => {
        this.socket.close();
    }
}
