const getTopicsFromDB = require('../models/topicModels')

function getTopics(req, res, next) {

    getTopicsFromDB().then((topics) => {

        res.status(200).json(topics)

    })

}

module.exports = getTopics
