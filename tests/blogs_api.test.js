import mongoose from 'mongoose';
import supertest from 'supertest';
import {app} from '../app.js';
import { initialBlogs, blogsInDB } from './blogs_helper.js';
import Blog from '../models/blog.js';
import {beforeEach, jest} from '@jest/globals';
jest.useRealTimers();
const api = supertest(app);

beforeEach(async () => {  
    await Blog.deleteMany({});

    const blogObjects = initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
});

test('blogs are json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  });

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
});

test('blog can be added', async () => {
    const newBlog = {
        "title": "new title",
        "author": "new author",
        "url": "new url",
        "likes": 23
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs');
    const contents = response.body.map(r => r.content);
    expect(response.body).toHaveLength(initialBlogs.length + 1);
  });

test('blog without content can not be added', async () => {
    const newBlog = {
      "title": "new title"
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  }, 60000);

test('blog can be viewed', async () => {
    const currentBlogsInDB = await blogsInDB();  
    const blogToView = currentBlogsInDB[1];
  
    const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    expect(resultBlog.body).toEqual(blogToView)
  });

test('id is not undefined', async () => {
  const currentBlogsInDB = await blogsInDB();
  const blogToView = currentBlogsInDB[0];
  
  const resultBlog = await api
  .get(`/api/blogs/${blogToView.id}`)
  .expect(200)
  .expect('Content-Type', /application\/json/)
  expect(resultBlog.body.id).toBeDefined();
});

test('set likes to 0 by default if likes number is missing', async () => {
  const newBlog = {
    "title": "new title",
    "author": "new 2 author",
    "url": "new 2 url",
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toEqual(0);
})
  
afterAll(async () => {
    jest.setTimeout(60000);
    await mongoose.connection.close()
  });