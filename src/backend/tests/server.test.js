/* eslint "no-undef": 0 */
/* eslint "consistent-return": 0 */
/* eslint "no-unused-vars": 0 */
/* eslint "max-len": [ "error", 100] */

const expect = require('expect');
const request = require('supertest');

const { server } = require('../server');
const { Message } = require('../db/Message');
const { User } = require('../db/User');
const { Room } = require('../db/Room');
const { errorMessages, errorTypes } = require('../utils/errorMessages');
const {
    roomsDummy,
    usersDummy,
    populateMessages,
    populateUsers,
    populateRooms
} = require('./seed/seed');

beforeEach(populateRooms);
beforeEach(populateUsers);
beforeEach(populateMessages);

describe('GET /messages/:name', () => {
    it('should get messages successfully', (done) => {
        request(server)
            .get(`/api/messages/${roomsDummy[0].name}`)
            .set('x-auth', usersDummy[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
            })
            .end(done);
    });

    it('should not get messages if not authenticated', (done) => {
        request(server)
            .get(`/api/messages/${roomsDummy[0].name}`)
            .expect(401)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.tokenInvalid);
                expect(res.body.errorType).toEqual(errorTypes.TOKEN_ERROR);
            })
            .end(done);
    });

    it('should not get messages from room that does not exist', (done) => {
        const badRoom = 'roomNotExists';
        request(server)
            .get(`/api/messages/${badRoom}`)
            .set('x-auth', usersDummy[0].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(
                    `${errorMessages.messagesNotFound}: ${badRoom}.`
                );
                expect(res.body.errorType).toEqual(errorTypes.MESSAGE_ERROR);
            })
            .end(done);
    });
});

describe('DELETE /messages/:name', () => {
    it('should delete messages successfully', (done) => {
        request(server)
            .delete(`/api/messages/${roomsDummy[0].name}`)
            .set('x-auth', usersDummy[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.status).toBe('OK');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Message.find({ room: roomsDummy[0].name })
                    .then((rooms) => {
                        expect(rooms.length).toBe(0);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not delete messages if not authenticated', (done) => {
        request(server)
            .delete(`/api/messages/${roomsDummy[0].name}`)
            .expect(401)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.tokenInvalid);
                expect(res.body.errorType).toEqual(errorTypes.TOKEN_ERROR);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Message.find({ room: roomsDummy[0].name })
                    .then((rooms) => {
                        expect(rooms.length).toBe(2);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not delete messages from room that does not exist', (done) => {
        const badRoom = 'roomNotExists';
        request(server)
            .delete(`/api/messages/${badRoom}`)
            .set('x-auth', usersDummy[0].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(
                    `${errorMessages.messagesNotFound}: ${badRoom}.`
                );
                expect(res.body.errorType).toEqual(errorTypes.MESSAGE_ERROR);
            })
            .end(done);
    });
});

describe('POST /rooms/join', () => {
    it('should join room successfully', (done) => {
        request(server)
            .post('/api/rooms/join')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .send({ room: roomsDummy[0].name })
            .expect(200)
            .expect((res) => {
                expect(res.body.room).toBe(roomsDummy[0].name);
            })
            .end(done);
    });

    it('should not join room successfully if not authenticated', (done) => {
        request(server)
            .post('/api/rooms/join')
            .send({ room: roomsDummy[0].name })
            .expect(401)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.tokenInvalid);
                expect(res.body.errorType).toEqual(errorTypes.TOKEN_ERROR);
            })
            .end(done);
    });

    it('should not return user if not authenticated', (done) => {
        request(server)
            .post('/api/rooms/join')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .send({ room: 'roomNotExists' })
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.roomToJoinNotFound);
                expect(res.body.errorType).toEqual(errorTypes.ROOM_ERROR);
            })
            .end(done);
    });
});

describe('GET /rooms', () => {
    it('should get rooms', (done) => {
        request(server)
            .get('/api/rooms/')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
                expect(res.body[0].name).toBe(roomsDummy[0].name);
            })
            .end(done);
    });
});

describe('POST /rooms', () => {
    it('should add room successfully', (done) => {
        const room = 'warsaw';
        request(server)
            .post('/api/rooms')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .send({ room })
            .expect(200)
            .expect((res) => {
                expect(res.body.creator).toBe(usersDummy[0].name);
                expect(res.body.name).toBe(room);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Room.find()
                    .then((rooms) => {
                        expect(rooms.length).toBe(3);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not add room if not authenticated', (done) => {
        const room = 'warsaw';
        request(server)
            .post('/api/rooms')
            .send({ room })
            .expect(401)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.tokenInvalid);
                expect(res.body.errorType).toEqual(errorTypes.TOKEN_ERROR);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Room.find()
                    .then((rooms) => {
                        expect(rooms.length).toBe(2);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not duplicate rooms', (done) => {
        request(server)
            .post('/api/rooms')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .send({ room: roomsDummy[0].name })
            .expect(422)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.roomExists);
                expect(res.body.errorType).toEqual(errorTypes.CREATE_ERROR);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Room.find()
                    .then((rooms) => {
                        expect(rooms.length).toBe(2);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not add room with bad name', (done) => {
        request(server)
            .post('/api/rooms')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .send({ room: 'oslo123213' })
            .expect(400)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.roomValidationError);
                expect(res.body.errorType).toEqual(errorTypes.CREATE_ERROR);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Room.find()
                    .then((rooms) => {
                        expect(rooms.length).toBe(2);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });
});

describe('DELETE /rooms', () => {
    it('should delete room successfully', (done) => {
        request(server)
            .delete('/api/rooms')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .send({ room: roomsDummy[0].name })
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(roomsDummy[0].name);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Room.find()
                    .then((rooms) => {
                        expect(rooms.length).toBe(1);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not delete room if not authenticated', (done) => {
        request(server)
            .delete('/api/rooms')
            .send({ room: roomsDummy[0].name })
            .expect(401)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.tokenInvalid);
                expect(res.body.errorType).toEqual(errorTypes.TOKEN_ERROR);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Room.find()
                    .then((rooms) => {
                        expect(rooms.length).toBe(2);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not delete room that does not exist', (done) => {
        request(server)
            .delete('/api/rooms')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .send({ room: 'roomNotExists' })
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.roomToDeleteNotFound);
                expect(res.body.errorType).toEqual(errorTypes.ROOM_ERROR);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Room.find()
                    .then((rooms) => {
                        expect(rooms.length).toBe(2);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });
});

describe('GET /users', () => {
    it('should return user information by token', (done) => {
        request(server)
            .get('/api/users/')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(usersDummy[0]._id.toHexString());
                expect(res.body.name).toBe(usersDummy[0].name);
            })
            .end(done);
    });

    it('should not return user if not authenticated', (done) => {
        request(server)
            .get('/api/users/')
            .expect(401)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.tokenInvalid);
                expect(res.body.errorType).toEqual(errorTypes.TOKEN_ERROR);
            })
            .end(done);
    });
});

describe('POST /users/register', () => {
    it('should create new user', (done) => {
        const [name, password] = ['fourthUser', 'userPass4'];
        request(server)
            .post('/api/users/register')
            .send({ name, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.name).toBe(name);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.find({ name })
                    .then((user) => {
                        expect(user.length).toBe(1);
                        expect(user[0].name).toBe(name);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not create new user after invalid password', (done) => {
        const [name, password] = ['fifthUser', 'pswd'];
        request(server)
            .post('/api/users/register')
            .send({ name, password })
            .expect(400)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.passwordInvalid);
                expect(res.body.errorType).toEqual(errorTypes.USER_ERROR);
            })
            .end(done);
    });

    it('should not create new user after invalid username', (done) => {
        const [name, password] = ['six][thUser', 'userPswd6'];
        request(server)
            .post('/api/users/register')
            .send({ name, password })
            .expect(400)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.usernameInvalid);
                expect(res.body.errorType).toEqual(errorTypes.USER_ERROR);
            })
            .end(done);
    });

    it('should not duplicate users', (done) => {
        const [name, password] = [usersDummy[0].name, 'userPswd3'];
        request(server)
            .post('/api/users/register')
            .send({ name, password })
            .expect(422)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.userExists);
                expect(res.body.errorType).toEqual(errorTypes.USER_ERROR);
            })
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('user should login successfully', (done) => {
        const [name, password] = [usersDummy[1].name, usersDummy[1].password];
        request(server)
            .post('/api/users/login')
            .send({ name, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.name).toBe(name);
            })
            .end(done);
    });

    it('unknown user should not login', (done) => {
        const [name, password] = ['someUser', 'userPswd10'];
        request(server)
            .post('/api/users/login')
            .send({ name, password })
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.userNotFound);
                expect(res.body.errorType).toEqual(errorTypes.USER_ERROR);
            })
            .end(done);
    });

    it('user should not login after typing wrong password', (done) => {
        const [name, password] = [usersDummy[2].name, 'wrongPassword'];
        request(server)
            .post('/api/users/login')
            .send({ name, password })
            .expect(401)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.incorrectPassword);
                expect(res.body.errorType).toEqual(errorTypes.USER_ERROR);
            })
            .end(done);
    });
});

describe('GET /users/refresh-token', () => {
    it('should refresh token successfully', (done) => {
        request(server)
            .get('/api/users/refresh-token')
            .set('x-auth', usersDummy[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.name).toBe(usersDummy[1].name);
            })
            .end(done);
    });

    it('should not refresh token if not authenticated', (done) => {
        request(server)
            .get('/api/users/refresh-token')
            .expect(401)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.tokenInvalid);
                expect(res.body.errorType).toEqual(errorTypes.TOKEN_ERROR);
            })
            .end(done);
    });
});


describe('DELETE /users/token', () => {
    it('should delete token', (done) => {
        request(server)
            .delete('/api/users/token')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(usersDummy[0].name);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ name: usersDummy[0].name })
                    .then((user) => {
                        expect(user.tokens.length).toBe(0);
                        expect(user.name).toBe(usersDummy[0].name);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not delete token if not authenticated', (done) => {
        request(server)
            .delete('/api/users/token')
            .expect(401)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.tokenInvalid);
                expect(res.body.errorType).toEqual(errorTypes.TOKEN_ERROR);
            })
            .end(done);
    });
});

describe('DELETE /users/token/all', () => {
    it('should delete all tokens', (done) => {
        request(server)
            .delete('/api/users/token/all')
            .send({ user: usersDummy[2].name })
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(usersDummy[2].name);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ name: usersDummy[2].name })
                    .then((user) => {
                        expect(user.tokens.length).toBe(0);
                        expect(user.name).toBe(usersDummy[2].name);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });
    });

    it('should not delete tokens of invalid user', (done) => {
        request(server)
            .delete('/api/users/token/all')
            .send({ user: 'badUser' })
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toEqual(errorMessages.userNotFound);
                expect(res.body.errorType).toEqual(errorTypes.USER_ERROR);
            })
            .end(done);
    });
});
