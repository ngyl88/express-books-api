const supertest = require("supertest");
const express = require("express");

/* Mongo Memory Server Test Setup */
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();

const Author = require("../models/author");
async function addFakeAuthors() {
  const author1 = new Author({
    name: "paulo",
    age: 49
  });
  await author1.save();

  const author2 = new Author({
    name: "john",
    age: 50
  });
  await author2.save();
}

/* Router Test Setup */
const authorRouter = require("./authors");

const app = express();
authorRouter(app);

const request = supertest(app);

/* Mongo Memory Server Test Setup */
beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);

  await addFakeAuthors();
});

/* TESTS */
test("GET /authors should return array of authors", async () => {
  const response = await request.get("/authors");
  expect(response.status).toBe(200);
  expect(response.body.message).toEqual(
    "List of authors retrieved successfully"
  );
  expect(response.body.authors).toBeInstanceOf(Array);
  expect(response.body.authors.length).toBe(2);
  expect(response.body.authors[0]).toMatchObject({ name: "paulo", age: 49 });
  expect(response.body.authors[1]).toMatchObject({ name: "john", age: 50 });
});

/* Mongo Memory Server Test Setup */
afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});
