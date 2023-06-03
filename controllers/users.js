import bcryptjs from 'bcryptjs';
import express from 'express';
export const usersRouter = express.Router();
import User from '../models/user.js';

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    if(password.length > 3){
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    }else{
        response.status(400).end();
    }
});

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url: 1, author: 1, title: 1, id: 1});
    response.json(users);
});