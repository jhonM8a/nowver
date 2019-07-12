'use strict'

const Sequelize = require('sequelize')
let sequelize = null
module.exports = function setupDatabase(config) {
    if (!sequelize) {
        sequelize = Sequelize(config)

    }

    return sequelize
}

