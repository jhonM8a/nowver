'use strict'
const debug = require('debug')('nowver:api:db')

module.exports = {
    db:{
        database: process.env.DB_NAME || 'nowver',
        username: process.env.DB_USER || 'user_db',
        password: process.env.DB_PASS || '1106',
        host: process.env.DB_HOST || '192.168.99.100',
        dialect: 'postgres',
        setup: 'true',
        logging: s => debug(s),
        port: '5432'
    },
    auth:{
        secret:process.env.SECRET || 'platzi'
    }
}