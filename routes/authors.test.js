const supertest = require("supertest");
const express = require("express");

/* Mongo Memory Server Test Setup */
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();

const Author = require("../models/author");

/* Test Data Setup */
let savedAuthor1 = {};
let savedAuthor2 = {};

async function addFakeAuthors() {
  const author1 = new Author({
    name: "paulo",
    age: 49
  });
  savedAuthor1 = await author1.save();
  const author2 = new Author({
    name: "john",
    age: 50
  });
  savedAuthor2 = await author2.save();
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
describe("GET requests", () => {
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

  test("GET /authors/:id should the correct author", async () => {
    // arrange
    const idToFind = savedAuthor1._id;
    const expected = savedAuthor1;

    // act
    const response = await request.get(`/authors/${idToFind}`);

    // assert
    expect(response.status).toBe(200);
    //   expect(response.body).toMatchObject({...expected.toJSON()});   // id is not matched
    expect(response.body.name).toEqual(expected.name);
    expect(response.body.age).toEqual(expected.age);
    expect(response.body.books).toEqual([]);
  });
});

describe("POST request", () => {
  test("POST /authors should return success message", async () => {
    // arrange
    const originalLength = (await Author.find()).length;
    const newAuthor = {
      name: "new author",
      age: 40
    };

    // act
    const response = await request.post("/authors").send(newAuthor);

    // assert
    expect(response.status).toBe(201);
    expect(response.body.message).toEqual(
      expect.stringContaining("created new author successfully")
    );
    const authors = await Author.find();
    expect(authors.length).toBe(originalLength + 1);
    expect(authors[originalLength]).toMatchObject({
      name: "new author",
      age: 40
    });
  });
});

describe("PUT request", () => {
  test("PUT /authors/:id should update the correct author", async () => {
    // arrange
    const authorToUpdate = await Author.findOne({ name: "john" });
    const idToUpdate = savedAuthor2._id;
    const updateAuthor = {
      name: "John Update",
      age: 10
    };

    // act
    const response = await request
      .put("/authors/" + idToUpdate)
      .send(updateAuthor);

    //assert
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      expect.stringContaining("updated author with id " + idToUpdate)
    );
    const author = await Author.findById(idToUpdate);
    expect(author).toMatchObject(updateAuthor);
  });
});

/* Mongo Memory Server Test Setup */
afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});
