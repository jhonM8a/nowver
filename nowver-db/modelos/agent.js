'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupAgentModel(config) {
    const sequelize = setupDatabase(config)
    /** Permite crear el objeto en base de datos con las propiedades indicadas */
    return sequelize.define('agent', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hostname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        connected: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValur: false
        }

    })
}
