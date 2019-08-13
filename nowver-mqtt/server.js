'use stric'

const debug = require('debug')('nowver:mqtt')
const mosca = require('mosca') 
const redis = require('readline')
const chalk = require('chalk')
const db = require("nowver-db")
const utils = require("nowver-utils")
const {parsePayload} = require('./utils')
const config = utils.db.config
const backed ={
    type:'redis',
    redis,
    return_buffers:true
}

const configFunciona = {
    database: process.env.DB_NAME || 'nowver',
    username: process.env.DB_USER || 'user_db',
    password: process.env.DB_PASS || '1106',
    host: process.env.DB_HOST || '192.168.99.100',
    dialect: 'postgres',
    logging: s => debug(s),
    port: '5432'
}

/**Configuración para el servidor mosca */
const settings = {
    port:1883,
    backed
}


const server = new mosca.Server(settings)
const clients = new Map()

let Agent, Metric

server.on('clientConnected', client =>{
    debug(`Client Connected : ${client.id}`)
    clients.set(client.id, null)
})

server.on('clientDisconnected', async client =>{
    debug(`Client Disconnected: ${client.id}`)
    const agent = clients.get(client.id)
    if(agent){
        //Marcar agente como desconectado
        agent.connected = false
        try {
            await Agent.createOrUpdate(agent)
        } catch (error) {
            handleError(error)
        }
        //Eliminar agente de la lista de clientes
        clients.delete(client.id)

        server.publish({
            topic :  'agent/disconnected',
            payload : JSON.stringify({
                agent:{
                    uuid: agent.uuid
                }
            })
        })

        debug(`Client ${client.id} associated to Agent ${agent.uuid} marked dissconnected`)
    }
})

server.on('published', async (packet, client)=>{
    debug(`Received: ${packet.topic}`)

    switch(packet.topic){
        case 'agent/connected':
        case 'agent/disconnected':
            debug(`Payload: ${packet.payload}`)
            break
        case 'agent/message':
            debug(`Payload: ${packet.payload}`)
            const payload = parsePayload(packet.payload)
            if(payload){
                payload.agent.connected = true
                let agent
                try {
                    agent = await Agent.createOrUpdate(payload.agent)
                } catch (error) {
                    return handleError(error)
                }
                debug(`Agent: ${agent.uuid} saved`)
                //Notificar que el agente fue conectado
                if(!clients.get(client.id)){
                    clientInformation.set(client.id, agent)
                    server.publish({
                        topic : 'agent/connected',
                        payload : JSON.stringify({
                            agent:{
                                uuid: agent.uuid,
                                name: agent.name,
                                hotname: agent.hotname,
                                pid: agent.pid,
                                connected : agent.connected
                            }

                        })
                    })
                }
                //Almacenar las metricas
                for(let metric of payload.metrics){
                    let m
                    try {
                        m = await Metric.create(agent.uuid, metric)
                    } catch (error) {
                        handleError(error)
                    }
                    debug(`Metric: ${m.id} saved on Agent: ${agent.uuid}`)
                }
            }
            break
    }

    
})

server.on('ready', async ()=>{
    console.log(config)
    const services = await db(configFunciona).catch(handleErrorfatal)
    Agent = services.Agent
    Metric = services.Metric

    console.log(`${chalk.green('[nowver-mqtt]')} server is runnig`)
})
/**Manejador de exepciones de emmiters */
server.on('error', handleErrorfatal)

function handleErrorfatal(error){
    console.error(`${chalk.red('[Fatal error: ]')} ${error.message}`)
    console.error(error.stack)
    process.exit(1)
}

function handleError(error){
    console.error(`${chalk.red('[ error: ]')} ${error.message}`)
    console.error(error.stack)
}
/**Manejadores de execpciones para execpciones no controladas
 * y para las promesas
 */
process.on('uncaughtException', handleErrorfatal)
process.on('unhandledRejection', handleErrorfatal)