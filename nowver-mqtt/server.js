'use strict'

const debug = require('debug')('nowver:mqtt')
const mosca = require('mosca') 
const redis = require('readline')
const chalk = require('chalk')


const backed ={
    type:'redis',
    redis,
    return_buffers:true
}

/**Configuración para el servidor mosca */
const settings = {
    port:1883,
    backed
}

const server = new mosca.Server(settings)

server.on('clientConnected', client =>{
    debug(`Client Connected : ${client.id}`)
})

server.on('clientDisconnected', client =>{
    debug(`Client Disconnected: ${client.id}`)
})

server.on('published', (packet, client)=>{
    debug(`Received: ${packet.topic}`)
    debug(`Payload: ${packet.payload}`)
})

server.on('ready', ()=>{
    console.log(`${chalk.green('[nowver-mqtt]')} server is runnig`)
})
/**Manejador de exepciones de emmiters */
server.on('error', handleErrorfatal)

function handleErrorfatal(error){
    console.error(`${chalk.red('[Fatal error: ]')} ${error.message}`)
    console.error(error.stack)
    process.exit(1)
}
/**Manejadores de execpciones para execpciones no controladas
 * y para las promesas
 */
process.on('uncaughtException', handleErrorfatal)
process.on('unhandledRejection', handleErrorfatal)