'use strict'

const http = require('http')
const chalk = require('chalk')
const express = require('express')
const debug = require('debug')('nowver:api')
const api = require('./api')
const asyncify = require('express-asyncify')


//Variables
const port = process.env.PORT || 3000

//Se crea una aplicaciòn de express que esta encapsulada dentro del wrapper
const app = asyncify(express())
//crear instancia del servidor http y se le pasa la app como requesrHandler
const server = http.createServer(app)
/** 
 * Se hace uso de middlewares de express
 * (funciones que se ejecutan antes de que
 *  una petición llegue a la ruta final).
 * 
 * */
app.use('/api', api)

// Express Error Handler
app.use((err, req, res, next) =>{
    debug(`Error: ${err.message}`)

    if(err.message.match(/not found/)){
        return res.status(404).send({error:err.message})
    }
    res.status(500).send({error:err.message})
})

function handleFatalError(err){
    console.error(`${chalk.red('[Fatal error]')} ${err.message}`)
    console.error(err.stack)
    process.exit(1)
}

/**Practica para pruebas: 
 * Si no se esta requeriendo el archivo
 * se levanta el servidor comun y corriente
 * de lo contrario no se ejecuta el server listen
 * 
 * 
*/
if(!module.parent){
    process.on('uncaughtException', handleFatalError)
    process.on('unhandledRejection', handleFatalError)
    
    server.listen(port, ()=>{
        console.log(`${chalk.green('[nowver-api]')}: server listening in port ${port}`)
    })
}

module.exports = server

