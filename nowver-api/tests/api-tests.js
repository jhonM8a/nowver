'use strict'

const test = require('ava')
const server = require('../server')
//Herramienta para poder realizar peticios con asserts  
const request = require('supertest')

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
            let body = res.body
            t.deepEqual(body, {}, 'response body should be the expected')
            t.end()  
        })
})