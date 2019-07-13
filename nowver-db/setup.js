'use stric'

const debug = require('debug')('nowver:db:setup')
const db = require('./')

async function setup() {
    const config = {
        database: process.env.DB_NAME || 'nowver',
        username: process.env.DB_USER || 'user_db',
        password: process.env.DB_PASS || '1106',
        host: process.env.DB_HOST || '192.168.99.100',
        dialect: 'postgres',
        setup: 'true',
        logging: s => debug(s),
        port: '5432'
    }
    await db(config).catch(handleFatalError)
    console.log('Succes!')
    process.exit(0)
}

function handleFatalError(err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(1)
}
setup()