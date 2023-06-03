import {MONGODB_URL} from './utils/config.js';
import express from 'express';
import 'express-async-errors';
export const app = express();
import cors from 'cors';
import {blogsRouter} from './controllers/blogs.js';
import {usersRouter} from './controllers/users.js';
import {requestLogger, unknownEndpoint, errorHandler, tokenExtractor } from './utils/middleware.js';
import {infoM} from './utils/logger.js';
import mongoose from 'mongoose';
import { loginRouter } from './controllers/login.js';

mongoose.set('strictQuery', false);

infoM('connecting to MongoDB');

mongoose.connect(MONGODB_URL)
    .then(result => {
        console.log('connected to MongoDB');
    })  
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use(requestLogger);
app.use(tokenExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);
