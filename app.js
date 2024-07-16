const express = require('express')
const getTopics = require('./controllers/topicController.js')
const endpoints = require('./endpoints.json')

const app = express()
app.use(express.json())

app.get('/api', (req, res, next) => {

    res.status(200).send({endpoints: endpoints})

})

app.get('/api/topics', getTopics)

app.all('*', (req, res) => {

    res.status(404).send({ message: 'Path not found.' });

  })

module.exports = app

