import {MONGODB_URL} from './utils/config.js';
import express from 'express';
export const app = express();
import cors from 'cors';
import {blogsRouter} from './controllers/blogs.js';
import {requestLogger, unknownEndpoint, errorHandler } from './utils/middleware.js';
import {infoM} from './utils/logger.js';
import {dummy} from './utils/list_helper.js';
import {test} from '@jest/globals'
import mongoose from 'mongoose';
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

test('dummy returns one', () => {
    const blogs = [];
  
    const result = dummy(blogs);
    expect(result).toBe(1);
  });

app.use(requestLogger);
app.use('/api/blogs', blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);


