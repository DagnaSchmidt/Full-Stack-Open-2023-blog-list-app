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
      response.json(blog);
    }else {
      response.status(404).end();
    }
});
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body;
    const newBlog = new Blog(body);
      const savedBlog = await newBlog.save();
      response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const deleteBlog = await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id);
  const newLikes = blogToUpdate.likes + 1
  const updatedLikes = await Blog.findByIdAndUpdate(request.params.id, {likes: newLikes });
  response.status(201).json(updatedLikes);
})