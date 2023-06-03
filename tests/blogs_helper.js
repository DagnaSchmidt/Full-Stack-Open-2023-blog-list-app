import Blog from '../models/blog.js';

export const initialBlogs = [{
    "title": "Sample title",
    "author": "Sample author",
    "url": "sample url",
    "likes": 45
},
{
    "title": "Sample 2 title",
    "author": "Sample 2 author",
    "url": "sample 2 url",
    "likes": 433
},
{
    "title": "validator",
    "author": "validator",
    "url": "validator",
    "likes": 1111,
    "id": "647b96e8b63786b721c92d72"
  }];

export const blogsInDB = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};