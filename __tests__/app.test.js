const request = require ('supertest')
const app = require('../app')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const endpoints = require('../endpoints.json')

beforeEach(() => {

    return seed(testData)

})

afterAll(() => {

    return db.end()

})

describe('/api/topics', () => {

    describe('Get /api/topics', () => {

        test('Returns correct status code when a response is sent with the appropriate array (containing objects with the right properties).', () => {

            return request(app).get('/api/topics').expect(200).then(res => {
                
                expect(Array.isArray(res.body)).toBe(true) // Overshadowed by the future part of the tests

                expect(res.body.length).toBeGreaterThan(0)

                res.body.forEach(topic => {
                    expect(topic).toHaveProperty('slug')
                    expect(topic).toHaveProperty('description')
                })

            })

        })

    })

})

describe('Returns 404 status if a bad route is asked for', () => {

    test('The test for what is said in describe', () => {

        return request(app).get('/api/not-an-endpoint').expect(404).then(res => {
        
            expect (res.body.message).toBe('Path not found.')

        })

    })

})

describe('Get /api', () => {

    test('Responds with a json detailing all available endpoints.', () => {

        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {

                expect(body.endpoints).toEqual(endpoints)

            })

    })

})

describe('/api/articles', () => {

    describe('Get /api/articles/:article_id', () => {

        test('Returns an article by its id and has the correct properties', () => {

            return request(app)
                .get('/api/articles/3')
                .expect(200)
                .then(({ body }) => {

                    expect(body).toHaveProperty('author')
                    expect(body).toHaveProperty('title')
                    expect(body).toHaveProperty('article_id')
                    expect(body).toHaveProperty('body')
                    expect(body).toHaveProperty('topic')
                    expect(body).toHaveProperty('created_at')
                    expect(body).toHaveProperty('votes')
                    expect(body).toHaveProperty('article_img_url')

                }) 

        })

        test('If given an article_id that does not exist, 404 status is returned.', () => {

            return request(app)
                .get('/api/articles/2000000')
                .expect(404)
                .then((res) => {
                    expect(res.body.message).toEqual("Article not found.");
                 })

        })

        test('If given an article_id in the wrong format, 400 status is returned.', () => {

            return request(app)
                .get('/api/articles/something')
                .expect(400)
                .then((res) => {
                    expect(res.body.message).toEqual('Invalid input.')
                })

        })

    })

})