'use strict'

const test = require('ava')
//Herramienta para poder realizar peticios con asserts  
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agenFixtures = require('./fixtures/agent')


//Def variables globales
let sandbox = null
let server  = null
let dbStub = null
let AgentStub = {}
let MetricStub = {}

test.beforeEach(async ()=>{
    sandbox = sinon.createSandbox()

    dbStub = sandbox.stub()
    dbStub.returns(Promise.resolve({
        Agent: AgentStub,
        Metric: MetricStub
    }))
    //Se definen funciones del Stup
    AgentStub.findConnected = sandbox.stub()
    AgentStub.findConnected.returns(Promise.resolve(agenFixtures.connected))
    const api = proxyquire('../api', {
        'nowver-db': dbStub
    })

    server = proxyquire('../server',{
        './api':api
    })
})

test.afterEach(()=>{
    sandbox && sinon.restore()
})


//Cuando se prueban funciones de tipo callback
test.serial.cb('/api/agents', t =>{
    /**
     * Se le pasa una instancia del 
     * servidor que se va a probar
    */
    request(server)
        .get('/api/agents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res)=>{
            t.falsy(err, 'should not return an error')
            let body = JSON.stringify(res.body)
            let expected = JSON.stringify(agenFixtures.connected)
            t.deepEqual(body, expected, 'response body should be the expected')
            t.end()  
        })
})
/**TODO */
test.serial.todo('/api/agent/:uuid')
test.serial.todo('/api/agent/:uuid - not found')

test.serial.todo('/api/metrics/:uuid')
test.serial.todo('/api/metrics/:uuid -not found')

test.serial.todo('/api/metrics/:uuid/:type')
test.serial.todo('/api/metrics/:uuid/:type -not foud')

