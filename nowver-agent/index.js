'use strict'

const debug = require('debug')('nowver:agent')
const clientMqtt = require('mqtt')
const defaults = require('defaults')
const EventEmitter = require('events')
const  {utils}  = require('nowver-utils')
const uuid = require('uuid')

const options = {
    name:'untilted',
    username: 'nowver',
    interval:5000,
    mqtt:{
        host:'mqtt://localhost'
    }
}

class nowvereAgent extends EventEmitter{
    constructor(opts){
        super()
        this._options = defaults(opts, options)
        this._started = false
        this._timer = null
        this._client = null
        this._agentId = null    
    }

    connect () {
        if(!this._started){
            const opts = this._options
            this._client = clientMqtt.connect(opts.mqtt.host)
            this._started =  true

            this._client.subscribe('agent/message')
            this._client.subscribe('agent/connected')
            this._client.subscribe('agent/disconnected')

            this._client.on('connected', ()=>{
                this._agentId = uuid.v4()

                this.emit('connected', this._agentId)
                
                this._timer = setInterval(()=>{
                    this.emit('agent/message', 'this a message')
                }, opts.interval)
            })

            this._client.on('message', (topic, payload)=>{
                payload = utils.parsePayload(payload)
                
                let broadcast = false

                switch(topic){
                    case 'agent/connected':
                    case 'agent/disconnected':
                    case 'agent/message':
                        broadcast = payload && payload.agent && payload.agent.uuid != this._agentId
                        break
                }

                if(broadcast){
                    this.emit(topic, payload)
                }

            })

            this._client.on('error', ()=>this.disconnect)


        }
    }

    disconnect () {
        if (this._started) {
            clearInterval(this._timer)
            this._started = false
            this.emit('disconnected')
        }
    }

}

module.exports = nowvereAgent