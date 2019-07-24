'use strict'

const db = require("../")

async function run() {

    const config = {
        database: process.env.DB_NAME || 'nowver',
        username: process.env.DB_USER || 'user_db',
        password: process.env.DB_PASS || '1106',
        host: process.env.DB_HOST || '192.168.99.100',
        dialect: 'postgres'
    }

    const { Agent, Metric } = await db(config).catch(hadleFatalError)
    const agent = await Agent.createOrUpdate({
        uuid: 'yyy-uuu-iii',
        name: 'test',
        username: 'test',
        hostname: 'test',
        pid: 1,
        connected: true

    }).catch(hadleFatalError)
    console.log("--Agent--")
    console.log(agent)

    const agents = await Agent.findAll().catch(hadleFatalError)
    console.log("--Agents--")
    console.log(agents)

    const metris = await Metric.findByAgentUuid(agent.uuid).catch(hadleFatalError)
    console.log("--Metric--")
    console.log(metris)

    const metric = await Metric.create(agent.uuid, {
        type: 'memory',
        value: '300'
    }).catch(hadleFatalError)
    console.log("--Metric--")
    console.log(metric)

    const metricsByType = await Metric.findByTypeAgentUuid('memory', agent.uuid).catch(hadleFatalError)
    console.log("--Metrics--")
    console.log(metricsByType)
}



function hadleFatalError(error) {
    console.error(error.message)
    console.error(error.stack)
    process.exit(1)

}

run()