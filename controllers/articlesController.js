const { getArticleFromDB, getAllArticlesFromDB, getAllCommmentsForAnArticleFromDB } = require('../models/articlesModels')

function getParticularArticle(req, res, next) {

    const { article_id } = req.params

    getArticleFromDB(article_id).then((article) => {

        res.status(200).send(article)

    }).catch((err) => {

        next(err)
        
    })

}

function getAllArticles(req, res, next) {

    getAllArticlesFromDB().then((articles) => {

        res.status(200).json(articles)

    }).catch((err) => {

        next(err)
        
    })

}

function getAllCommentsForAnArticle(req, res, next) {

    const { article_id } = req.params

    getAllCommmentsForAnArticleFromDB(article_id).then((arrayOfComments) => {

        res.status(200).json(arrayOfComments)

    }).catch((err) => {
        next(err)
    })

}

module.exports = { getParticularArticle, getAllArticles, getAllCommentsForAnArticle }