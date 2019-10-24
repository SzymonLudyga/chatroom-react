const errorMessages = {
    server: 'Server error',
    messagesNotFound: 'Messages not found for the room',
    roomToDeleteNotFound: 'Error deleting the room: Room not found',
    roomsNotFound:  'No rooms found',
    roomsNumberExceeded: 'Too many rooms created. Choose one from the list',
    roomValidationError: `Room must contain 4-20 letters`,
    roomExists: 'Room already exists',
    roomToJoinNotFound: 'Error joining the room: Room not found',
    tokenInvalid: 'Token not found or invalid'
}

const errorTypes = {
    MESSAGE_ERROR: 'message-error',
    ROOM_ERROR:'room-error',
    CREATE_ERROR: 'create-room',
    TOKEN_ERROR: 'token'
}

module.exports = {
    errorMessages, errorTypes
}