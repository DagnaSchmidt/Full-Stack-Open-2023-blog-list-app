import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import supertest from 'supertest';
import {app} from '../app.js';
import {usersInDB} from './users_helper.js';
import User from '../models/user.js';
import {beforeEach, jest} from '@jest/globals';
jest.useRealTimers();
const api = supertest(app);

describe('one user in DB', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcryptjs.hash('secret', 10);
        const user = new User({ username: 'root', passwordHash });

        await user.save();
    });

    test('user created with new username', async () => {
        const currentUsersInDB = await usersInDB();

        const newUser = {
            "username" : "Jose",
            "name" : "Josefine",
            "password" : "anotherPassword"
        }

        await api 
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const changedUsersInDB = await usersInDB();
        expect(changedUsersInDB).toHaveLength(currentUsersInDB.length + 1);

        const usernames = changedUsersInDB.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('no user created when username length < 3', async () => {
        const currentUsersInDB = await usersInDB();

        const newUser = {
            "username" : "Jo",
            "name" : "Josefine",
            "password" : "anotherPassword"
        }

        await api 
        .post('/api/users')
        .send(newUser)
        .expect(400)

        const response = await api.get('/api/users');
        expect(response.body).toHaveLength(currentUsersInDB.length);
    })
});

afterAll(async () => {
    jest.setTimeout(60000);
    await mongoose.connection.close();
  });