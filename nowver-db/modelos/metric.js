'use strict'
const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupMetricModel(config) {
    const sequelize = setupDatabase(config)
    /** Permite crear el objeto en base de datos con las propiedades indicadas */
    return sequelize.define('metric', {
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        value: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    })
}
