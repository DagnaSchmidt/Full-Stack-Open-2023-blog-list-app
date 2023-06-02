import express from 'express';
export const blogsRouter = express.Router();
import Blog from '../models/blog.js';

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if(blog) {
      response.json(blog)
    }else {
      response.status(404).end()
    }
});
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body;
    const newBlog = new Blog(body);
      const savedBlog = await newBlog.save();
      response.status(201).json(savedBlog);
});