const errorMessages = {
    server: 'Server error',
    messagesNotFound: 'Messages not found for the room',
    roomToDeleteNotFound: 'Error deleting the room: Room not found',
    roomsNotFound:  'No rooms found',
    roomsNumberExceeded: 'Too many rooms created. Choose one from the list',
    roomValidationError: `Room must contain 4-20 letters`,
    roomExists: 'Room already exists',
    roomToJoinNotFound: 'Error joining the room: Room not found',
    tokenInvalid: 'Token not found or invalid',
    passwordInvalid: 'Password should contain at least (non-space) 6 characters',
    usernameInvalid: 'User should contain at least (non-space) 4 characters',
    userExists: 'User with this name already exists',
    userNotFound: 'Invalid username. Try again.',
    incorrectPassword: 'Invalid password. Try again.',
}

const errorTypes = {
    MESSAGE_ERROR: 'message-error',
    ROOM_ERROR:'room-error',
    CREATE_ERROR: 'create-room',
    TOKEN_ERROR: 'token',
    USER_ERROR: 'user-error',
}

module.exports = {
    errorMessages, errorTypes
}