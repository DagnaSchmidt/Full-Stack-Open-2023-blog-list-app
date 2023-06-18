import express from 'express';
export const testingRouter = express.Router();
import Blog from '../models/blog.js';
import User from '../models/user.js';

testingRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    response.status(204).end();
  });