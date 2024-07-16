const db = require('../db/connection')

function getTopicsFromDB() {

    return db.query('SELECT * FROM topics')
        .then((result) => {
            return result.rows
        })

}

module.exports = getTopicsFromDB