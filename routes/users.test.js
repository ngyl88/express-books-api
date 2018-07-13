const supertest = require('supertest');
const express = require('express');

const userRouter = require('./users');
const app = express();
userRouter(app);
const request = supertest(app);

/* Test Data Setup */
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();

/* Mongo Memory Server Test Setup */
const User = require('../models/user');

beforeAll(async () => {
    jest.setTimeout(120000);
  
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri);
  });

test('GET /users returns the list of users', async () => {
    const response = await request.get('/users');
    expect(response.body.message).toEqual('List of users retrieved successfully');
    expect(response.body.users).toBeInstanceOf(Array);

    const users = await User.find();
    expect(response.body.users).toEqual(users);
});

/* Mongo Memory Server Test Setup */
afterAll(() => {
    mongoose.disconnect();
    mongod.stop();
  });