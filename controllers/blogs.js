import express from 'express';
export const blogsRouter = express.Router();
import jwt from "jsonwebtoken";
import {SECRET} from '../utils/config.js';
import Blog from '../models/blog.js';
import User from '../models/user.js';

// const getTokenFrom = request => {
//   const authorization = request.get('Authorization');
//   if(authorization && authorization.startsWith('Bearer ')){
//     return authorization.replace('Bearer ', ''); 
//   }  
//   return null;
// }

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1});
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

    const decodedToken = jwt.verify(request.body.token, SECRET);
    console.log(decodedToken);
    if(!decodedToken.id){
      return response.status(401).json({error: 'invalid token'});
    }

    const user = await User.findById(decodedToken.id);
    const newBlog = new Blog({...body, user: user._id});

      const savedBlog = await newBlog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
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