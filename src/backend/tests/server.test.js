const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');

const { server } = require('../server');
const { Message } = require('../db/Message');
const { User } = require('../db/User');
const { Room } = require('../db/Room');
const {
    roomsDummy,
    messagesDummy,
    usersDummy,
    populateMessages,
    populateUsers,
    populateRooms
} = require('./seed/seed');

beforeEach(populateRooms);
beforeEach(populateUsers);
beforeEach(populateMessages);

describe('POST /users/register', () => {
  it('should create new user', done => {
    const [ name, password ] = ['fourthUser', 'userPass4'];
    request(server)
        .post('/api/users/register')
        .send({ name, password })
        .expect(200)
        .expect(res => {
            expect(res.body.name).toBe(name);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            User.find({ name })
                .then(user => {
                    expect(user.length).toBe(1);
                    expect(user[0].name).toBe(name);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
  });
});
