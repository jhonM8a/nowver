'use strict'
/**Con este archivo
 * el servidor podra montar sus rutas dentro de su aplicación
 */
const debug = require('debug')('nowver:api:routes')
const express = require('express')
const db = require('nowver-db')
const auth = require('express-jwt')
const utils = require('nowver-utils')
const configTest = {
    database: process.env.DB_NAME || 'nowver',
    username: process.env.DB_USER || 'user_db',
    password: process.env.DB_PASS || '1106',
    host: process.env.DB_HOST || '192.168.99.100',
    dialect: 'postgres',
    port: '5432'
}
const config = require('./config')
//Permite dar soporte async y await a middleware y rutas de express
const asyncify = require('express-asyncify')


let services, Agent, Metric

const api = asyncify(express.Router())

api.use('*', async (req, res, next)=>{
    if(!services){
        debug('Connecting to Database')
        debug(utils.db)
        try {
            services = await db(configTest)
        } catch (error) {
            return next(error)
        }
        Agent = services.Agent
        Metric = services.Metric
    }
    next()
})

api.get('/agents', auth(config.auth),async (req, res, next)=>{
    debug('A request has come to /agents')
    
    const {user} = req

    if(!user || !user.username){
        return next(new Error('Not authorized'))
    }

    let agents = []
    try {
        debug(`User token: ${user.username}`)
        if(!user.jochoa){

            agents = await Agent.findConnected()
        }else{
            agents = await Agent.findByUsername(user.username)
        }
    } catch (error) {
        return next(error)
    }
    res.send(agents)
})
api.get('/agent/:uuid', async(req, res, next)=>{
    const { uuid } = req.params
    debug(`request to /agent/${uuid}`)
    let agent
    try {
        agent = await Agent.findByUuid(uuid)
    } catch (error) {
        next(error)
    }
    if(!agent){
        return next(new Error(`Agent not found with uiid: ${uuid}`))
    }

    res.send(agent)
})
api.get('/metrics/:uuid', async (req, res, next)=>{
    const { uuid } = req.params

    let metrics = []
    try {
        metrics = await Metric.findByAgentUuid(uuid)
    } catch (error) {
        next(error)
    }
    if(!metrics || metrics.length===0){
        return next(new Error(`Metrics not found for Agent with uiid: ${uuid}`))
    }
    res.send(metrics)
})
api.get('/metrics/:uuid/:type',async (req, res, next) =>{
    const { uuid, type } = req.params
    debug(`request to /metrics/${uuid}/${type}`)
    let metrics = []
    try {
        metrics = await Metric.findByTypeAgentUuid(type, uuid)
    } catch (error) {
        next(error)
    }
    if(!metrics || metrics.length===0){
        return next(new Error(`Metrics (${type}) not found for Agent with uiid: ${uuid}`))
    }
    res.send(metrics)
})
module.exports = api