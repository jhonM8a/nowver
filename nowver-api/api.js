'use strict'
/**Con este archivo
 * el servidor podra montar sus rutas dentro de su aplicación
 */
const debug = require('debug')('nowver:api:routes')
const express = require('express')
const db = require('nowver-db')
const utils = require('nowver-utils')
//Permite dar soporte async y await a middleware y rutas de express
const asyncify = require('express-asyncify')


let services, Agent, Metric

const api = asyncify(express.Router())

api.use('*', async (req, res, next)=>{
    if(!services){
        debug('Connecting to Database')
        try {
            services = await db(utils.db)
        } catch (error) {
            return next(error)
        }
        Agent = services.Agent
        Metric = services.Metric
    }
    next()
})

api.get('/agents',(req, res)=>{
    debug('A request has come to /agents')
    res.send({})
})
api.get('/agent/:uuid', (req, res, next)=>{
    const { uuid } = req.params
    
    if(uuid !== 'yy'){
        return next(new Error('Agent not found'))
    }

    res.send({uuid})
})
api.get('/metrics/:uuid', (req, res)=>{
    const { uuid } = req.params
    res.send({uuid})
})
api.get('/metrics/:uuid/:type', (req, res) =>{
    const { uuid, type } = req.params
    res.send({uuid,type})
})
module.exports = api