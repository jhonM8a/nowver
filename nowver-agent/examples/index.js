const NowverAgent = require('../')

const agent = new NowverAgent({
    name:'myapp',
    username:'admin',
    interval:2000
})

agent.addMetric('rss', function getRss(){
    return process.memoryUaGE
})

agent.connect()
//This event is only agent
agent.on('connected')
agent.on('disconnected')
agent.on('message')

//Others Agents
agent.on('agent/connected')
agent.on('agent/disconnected')
agent.on('agent/message', payload =>{
    console.log(payload)
})

setTimeOut(() => agent.disconnect(), 10000)