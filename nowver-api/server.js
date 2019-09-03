'use strict'

const http = require('http')
const chalk = require('chalk')
const express = require('express')

//Variables
const port = process.env.PORT || 3000

//Se crea una aplicaciòn de express
const app = express()
//crear instancia del servidor http y se le pasa la app como requesrHandler
const server = http.createServer(app)

server.listen(port, ()=>{
    console.log(`${chalk.green('[nowver-api]')}: server listening in port ${port}`)
})


