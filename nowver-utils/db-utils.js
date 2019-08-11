'use strict'
process.env.NODE_ENV = 'production';
module.exports = {
    config:()=>({
        database: process.env.DB_NAME || 'nowver',
        username: process.env.DB_USER || 'user_db',
        password: process.env.DB_PASS || '1106',
        host: process.env.DB_HOST || '192.168.99.100',
        dialect: 'postgres',
        port: '5432'
    })
}