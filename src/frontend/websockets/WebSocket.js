const io = require('socket.io-client');

export default class WebSocket {
    constructor(url) {
        this.socket = io(url)
    }

    listen = (query, data = null) => {
        this.socket.on(query, data);
    }

    emit = (query, data = null) => {
        this.socket.emit(query, data);
    }
}
