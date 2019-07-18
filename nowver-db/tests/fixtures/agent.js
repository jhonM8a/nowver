'use stric'

const agent = {
    id: 1,
    uuid: 'JJJ-HH-OO',
    name: 'fixture',
    username: 'nowere',
    hostname: 'test-host',
    pid: '0',
    connected: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

const agents = [
    agent,
    extend(agent, {
        id: 2,
        uuid: 'MMM-HH-OO',
        username: 'test',
        connected: false
    }),
    extend(agent, { id: 3, uuid: 'NNN-HH-OO' }),
    extend(agent, { id: 4, uuid: 'LLL-HH-OO', username: 'test' })
]

function extend(obj, values) {
    const clone = Object.assign({}, obj)
    return Object.assign(clone, values)
}

module.exports = {
    single: agent,
    all: agents,
    connected: agents.filter(a => a.connected),
    test: agents.filter(a => a.username === 'test'),
    byUuid: id => agents.filter(a => a.uuid === id).shift(),
    byId: id => agents.filter(a => a.id === id).shift()
}