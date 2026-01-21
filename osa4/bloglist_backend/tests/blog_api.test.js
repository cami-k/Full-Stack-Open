const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('identifier property of the returned blogs is named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body.every(blog => Object.hasOwn(blog, "id") && !Object.hasOwn(blog, "_id")));
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog = {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert(Object.hasOwn(response.body, "likes"))
  assert.strictEqual(response.body.likes, 0)

})

test('blog without title is not added', async () => {
  const newBlog = {
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

})

test('blog without url is not added', async () => {
  const newBlog = {
    title: "TDD harms architecture",
    author: "Robert C. Martin"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(n => n.id)

  assert(!ids.includes(blogToDelete.id))
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('a blog can be modified', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToModify = blogsAtStart[0]

  const modifiedBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 13
  }

  const resultBlog = await api
    .put(`/api/blogs/${blogToModify.id}`)
    .send(modifiedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const ids = blogsAtEnd.map(n => n.id)

  assert(ids.includes(resultBlog.body.id))
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  assert.strictEqual(resultBlog.body.likes, 13)
  assert.strictEqual(resultBlog.body.id, blogToModify.id)
})

after(async () => {
  await mongoose.connection.close()
})

