const request = require ('supertest')
const app = require('../app')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')

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