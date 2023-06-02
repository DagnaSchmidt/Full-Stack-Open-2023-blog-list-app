import express from 'express';
export const blogsRouter = express.Router();
import Blog from '../models/blog.js';

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
  });
  
blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body);
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result);
      });
  });