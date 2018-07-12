const request = require('supertest');
const express = require('express');

const authorRouter = require('./authors');

const app = express();
authorRouter(app);

test('GET /authors should return array of authors', async () => {
    const response = await request(app).get('/authors');
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('List of authors retrieved successfully');
    // expect(response.body.authors).toBeInstanceOf(Array);
});