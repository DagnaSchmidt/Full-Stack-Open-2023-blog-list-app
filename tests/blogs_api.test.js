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

describe('everything POST blog related', () => {

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
});

describe('everything related to GET all data', () => {

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
});

describe('everything related to GET one blog', () => {
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
});

describe('everything related to DELETE one blog', () => {
  test('delete one post', async () => {
    const currentBlogsInDB = await blogsInDB();
    const blogToDelete = currentBlogsInDB[0];

    const deletedBlog = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const changedBlogsDB = await blogsInDB();
    expect(changedBlogsDB).toHaveLength(initialBlogs.length - 1);

    const ids = changedBlogsDB.map(r => r.id);
    expect(ids).not.toContain(blogToDelete.id);
  })
});

describe('everything related to update one blog', () => {
  test('update likes +1', async () => {
    const currentBlogsInDB = await blogsInDB();
    const blogToUpdate = currentBlogsInDB[0];
    const oldLikes = blogToUpdate.likes;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const changedBlogsDB = await blogsInDB();
    const updatedBlog = changedBlogsDB[0];
    expect(updatedBlog.likes).toEqual(oldLikes +1);
  })
})
  
afterAll(async () => {
    jest.setTimeout(60000);
    await mongoose.connection.close();
  });