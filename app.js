import {MONGODB_URL} from './utils/config';
import express from 'express';
export const app = express();
import cors from 'cors';
import {blogsRouter} from './controllers/blogs';
import {middleware} from './utils/middleware';
import {info, error} from './utils/logger';
import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());

info('connecting to MongoDB');

mongoose.connect(MONGODB_URL)
    .then(result => {
        console.log('connected to MongoDB');
    })  
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });