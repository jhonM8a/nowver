'use stric'

const debug = require('debug')('nowver:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')

const prompt = inquirer.createPromptModule()

async function setup() {
    const answer = await prompt([{
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your database, are you sure?'
    }])

    if (!answer.setup) {
        return console.log('Nothing happened')
    }
    const config = {
        database: process.env.DB_NAME || 'nowver',
        username: process.env.DB_USER || 'user_db',
        password: process.env.DB_PASS || '110',
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
    console.error(`${chalk.red('[Fatal Error]')} ${err.message}`)
    console.error(err.stack)
    process.exit(1)
}
setup()