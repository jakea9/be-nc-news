const express = require('express')
const getTopics = require('./controllers/topicController.js')
const { getParticularArticle, getAllArticles, getAllCommentsForAnArticle, postComment } = require('./controllers/articlesController.js')
const endpoints = require('./endpoints.json')

const app = express()
app.use(express.json())

app.get('/api', (req, res, next) => {

    res.status(200).send({endpoints: endpoints})

})

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getParticularArticle)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getAllCommentsForAnArticle)

app.post('/api/articles/:article_id/comments', postComment)

app.all('*', (req, res) => {

    res.status(404).send({ message: 'Path not found.' });

  })

app.use((err, req, res, next) => {
  
  if (err.status && err.message) {
    res.status(err.status).send({message : err.message})
  }
  next(err)
})

app.use((err, req, res, next) => {

  if (err.code === '22P02') {
    res.status(400).send({message: 'Invalid input.'})
  }

  next(err)

})

module.exports = app

