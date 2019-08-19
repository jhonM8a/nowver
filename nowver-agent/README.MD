# nowver-agent

## Usage

``` js
const NowverAgent = require('nowver-agent')

const agent = new NowverAgent({
    interval:2000
})

agent.connect()
//This event is only agent
agent.on('connected')
agent.on('disconnected')
agent.on('message')

//Others events
agent.on('agent/connected')
agent.on('agent/disconnected')
agent.on('agent/message', payload =>{
    console.log(payload)
})

setTimeOut(() => agent.disconnect(), 20000)

```