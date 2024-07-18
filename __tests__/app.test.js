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

    describe('Get /api/articles', () => {

        test('Status 200 and responsds with all articles in the case where the endpoint is correct.', () => {

            return request(app)
                .get('/api/articles')
                .expect(200)
                .then((res) => {

                    expect(res.body.length).toBeGreaterThan(0)

                    res.body.forEach(article => {

                        

                        expect(article).toHaveProperty('author')
                        expect(article).toHaveProperty('title')
                        expect(article).toHaveProperty('article_id')
                        expect(article).toHaveProperty('topic')
                        expect(article).toHaveProperty('created_at')
                        expect(article).toHaveProperty('votes')
                        expect(article).toHaveProperty('article_img_url')
                        expect(article).toHaveProperty('comment_count')

                        expect(article).not.toHaveProperty('body')

                    })


                })


        })

        test('Articles should be sorted by data, starting with the most recent.', () => {

            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(result => {
                    expect(result.body).toBeSortedBy('created_at', {
                        descending: true
                    })

                })


        })

    })

    describe('/api/articles/:article_id/comments', () => {

        test('Get all comments for an article with each one having the expected properties', () => {

            return request(app)
                .get('/api/articles/3/comments')
                .expect(200)
                .then((res) => 
                
                    expect(res.body).toEqual([ {
                        body: "Ambidextrous marsupial",
                        votes: 0,
                        author: "icellusedkars",
                        article_id: 3,
                        created_at: "2020-09-19T23:10:00.000Z",
                        comment_id: 11,
                      }, {
                        body: "git push origin master",
                        votes: 0,
                        author: "icellusedkars",
                        article_id: 3,
                        created_at: "2020-06-20T07:24:00.000Z",
                        comment_id: 10,
                      }])
                
                )

        })

        test('Returns comments with in order of most recent', () => {

            return request(app)
                .get('/api/articles/3/comments')
                .expect(200)
                .then((res) => {

                    expect(res.body).toBeSortedBy('created_at', {
                        descending: true
                    })

                })

        })

        test('Get an empty array if the article has no comments', () => {

            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then((res) => 
                
                    expect(res.body).toEqual([])
                
                )

        })


        test('If an article is in the endpoint that does not exist, a message says Article not found.', () => {

            return request(app)
                .get('/api/articles/2000000/comments')
                .expect(404)
                .then(res => {

                    expect(res.body.message).toBe('Article not found.')

                })

        })

        test('Responds with a message invalid input if the wrong datatype is passed', () => {

            return request(app)
                .get('/api/articles/datatype/comments')
                .expect(400)
                .then((res) => 
                
                    expect(res.body.message).toBe('Invalid input.')
                
                )

        })

    })

    describe('POST /api/articles/:article_id/comments', () => {

        test('A comment is added to the appropriate article', () => {

            return request(app)
                .post('/api/articles/2/comments')
                .send({ username: 'lurker' , body: 'Comment'})
                .expect(201)
                .then((res) => {

                    expect(res.body).toEqual({ commentAdded : 'Comment' })

                })


        })

        test('Respond with status of 400 if an invalid data type is used for the id', () => {

            return request(app)
                .post('/api/articles/wrongdatatype/comments')
                .expect(400)
                .then((res) => {

                    expect(res.body.message).toBe('Invalid input.')

                })


        })

        test('Respond with status of 404 if a valid data type is used for the id, but it does not exist.', () => {

            return request(app)
                .post('/api/articles/20000000/comments')
                .expect(404)
                .then((res) => {

                    expect(res.body.message).toBe('Article not found.')

                })


        })


    })

})