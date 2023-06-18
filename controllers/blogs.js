import express from 'express';
export const blogsRouter = express.Router();
import Blog from '../models/blog.js';
import User from '../models/user.js';

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

    if(!request.body.user){
      return response.status(401).json({error: 'invalid token'});
    }

    const user = await User.findById(request.body.user.id);
    const newBlog = new Blog({...body, user: user._id});

      const savedBlog = await newBlog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();
      response.status(201).json(savedBlog);
});

blogsRouter.put('/:id/comments', async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id);
  const newComment = request.body;
  if(blogToUpdate.comments.length !== 0){
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {comments: [...blogToUpdate.comments, newComment]});
    response.status(201).json(updatedBlog);
  }else{
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {comments: [newComment]});
    response.status(201).json(updatedBlog);
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id);

  if(request.body.user.id === blogToDelete.user.toString()){
    const deleteBlog = await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  }else{
    return response.status(401).json({error: 'Unauthorized'});
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id);
  const newLikes = blogToUpdate.likes + 1
  const updatedLikes = await Blog.findByIdAndUpdate(request.params.id, {likes: newLikes });
  response.status(201).json(updatedLikes);
});