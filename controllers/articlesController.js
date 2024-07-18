const { commentData } = require('../db/data/test-data')
const { getArticleFromDB, getAllArticlesFromDB, getAllCommmentsForAnArticleFromDB, postACommentToDB, updateArticleVotesInDB} = require('../models/articlesModels')

function getParticularArticle(req, res, next) {

    const { article_id } = req.params

    return getArticleFromDB(article_id).then((article) => {

        res.status(200).send(article)

    }).catch((err) => {

        next(err)
        
    })

}

function getAllArticles(req, res, next) {

    return getAllArticlesFromDB().then((articles) => {

        res.status(200).json(articles)

    }).catch((err) => {

        next(err)
        
    })

}

function getAllCommentsForAnArticle(req, res, next) {

    const { article_id } = req.params

    return getAllCommmentsForAnArticleFromDB(article_id).then((arrayOfComments) => {

        res.status(200).json(arrayOfComments)

    }).catch((err) => {
        next(err)
    })

}

function postComment(req, res, next) {

    const {article_id} = req.params
    const { username, body }  = req.body

    return getArticleFromDB(article_id).then(() => {

        return postACommentToDB(article_id, username, body)

        }).then((commentAdded) => {

            res.status(201).send({commentAdded : commentAdded})

        }).catch(next)

}

function updateArticleVotes(req, res, next) {

    const {article_id} = req.params
    const { inc_votes }  = req.body

    return getArticleFromDB(article_id).then(() => {

        return updateArticleVotesInDB(article_id, inc_votes)

        }).then((article) => {

            res.status(200).send(article)

        }).catch(err => next(err))

}

module.exports = { getParticularArticle, getAllArticles, getAllCommentsForAnArticle, postComment, updateArticleVotes }