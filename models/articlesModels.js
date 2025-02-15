const db = require('../db/connection')

function getArticleFromDB(article_id) {

    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((result) => {

        if (result.rows.length === 0) {

            return Promise.reject({status: 404, message: 'Article not found.'})

        }

        return result.rows[0]

    })
}

function getAllArticlesFromDB() {

    return db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;')
    .then((result) => {

        return result.rows

    })
}

function getAllCommmentsForAnArticleFromDB(article_id) {

    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]).then(article => {

        if (article.rows.length === 0) {
            return Promise.reject({status: 404, message: 'Article not found.'})
        } else {
            return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC;', [article_id])
        .then(comments => {
            
            return comments.rows

        })
        }

    })

}

function postACommentToDB(article_id, username, body) {

    return db.query('INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *', [article_id, username, body])
    .then(output => {
        return output.rows[0].body
    })



}

function updateArticleVotesInDB(article_id, inc_votes) {

    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, article_id])
    .then((output) => {
        return output.rows[0]
    })

}

function deleteSpecificComment(comment_id) {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [comment_id])
    .then((output) => {
        
        if (output.rows.length === 0) {
            return Promise.reject({status: 404, message: 'Article not found.'})
        }
 
        return output.rows[0]
    })

}

function getUsersFromDB() {

    return db.query('SELECT username, name, avatar_URL FROM users')
        .then(result => {

            return result.rows

        })

}

module.exports ={ getArticleFromDB, getAllArticlesFromDB, getAllCommmentsForAnArticleFromDB, postACommentToDB, updateArticleVotesInDB, deleteSpecificComment, getUsersFromDB}