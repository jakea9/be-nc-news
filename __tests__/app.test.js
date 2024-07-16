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

        test('', () => {

            return request(app).get('/api/topics').expect(200).then(res => {
                
                expect(Array.isArray(res.body)).toBe(true)

                expect(res.body.length).toBeGreaterThan(0)

                res.body.forEach(topic => {
                    expect(topic).toHaveProperty('slug')
                    expect(topic).toHaveProperty('description')
                })

            })

        })

    })

})