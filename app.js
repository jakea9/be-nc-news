const express = require('express')
const getTopics = require('./controllers/topicController.js')
const getParticularArticle = require('./controllers/articlesController.js')
const endpoints = require('./endpoints.json')

const app = express()
app.use(express.json())

app.get('/api', (req, res, next) => {

    res.status(200).send({endpoints: endpoints})

})

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getParticularArticle)

app.all('*', (req, res) => {

    res.status(404).send({ message: 'Path not found.' });

  })

module.exports = app

