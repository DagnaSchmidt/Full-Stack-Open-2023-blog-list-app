import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import Blog from '../models/blog.js';
import {beforeEach, jest} from '@jest/globals';
jest.useRealTimers();
const api = supertest(app);

const initialBlogs = [{
    "title": "Sample title",
    "author": "Sample author",
    "url": "sample url",
    "likes": 45
}];

beforeEach(async () => {  
    await Blog.deleteMany({});
    let blogObject = new Blog(initialBlogs[0]);
    await blogObject.save();
})

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
    jest.setTimeout(60000);
    const newBlog = {
      "title": "new title"
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(initialNotes.length);
  }, 10000);
  
afterAll(async () => {
    jest.setTimeout(60000);
    await mongoose.connection.close()
  });