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
}];

export const blogsInDB = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};