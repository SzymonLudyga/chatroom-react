const io = require('socket.io-client');

export default class WebSocket {
    constructor(url) {
        this.socket = io(url);
    }

    onMessage = (query, data = null) => {
        this.socket.on(query, data);
    }

    emitMessage = (query, data = null) => {
        this.socket.emit(query, data);
    }
}
