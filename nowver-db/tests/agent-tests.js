"use stric"

const test = require("ava")
const proxiquire = require("proxyquire")
const sinon = require("sinon")
const agentFixtures = require('./fixtures/agent')

let db = null;
let sandbox = null
let uuid = "JJJ-HH-OO"
/**Para tener instancias por aparte del fixtures */
let single = Object.assign({}, agentFixtures.single)
/**Argumentos que reciben las funciones de AgentModel */
let connectedArgs = { where: { connected: true } }
let usernameArgs = {
  where: { username: 'nowere', connected: true }
}


let newAgent = {
  uuid: '333J-HH-OO',
  name: 'fixture',
  username: 'jhon',
  hostname: 'test-host',
  pid: '0',
  connected: false,

}

let id = 1
let config = {
  logging: function () { }
}
let uuidArgs = {
  where: {
    uuid
  }
}
let MetricStub = {
  belongsTo: sinon.spy()
}

let AgentStub = null

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }

  //Model findById Stub
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))
  //Model findOne stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))
  //Model update stup
  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))
  //Model create stup
  AgentStub.create = sandbox.stub()
  AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
    toJSON() { return newAgent }
  }))
  //Model findAll stub
  AgentStub.findAll = sandbox.stub()
  AgentStub.findAll.withArgs().returns(Promise.resolve(agentFixtures.all))
  AgentStub.findAll.withArgs(connectedArgs).returns(Promise.resolve(agentFixtures.connected))
  AgentStub.findAll.withArgs(usernameArgs).returns(Promise.resolve(agentFixtures.test))

  const setupDatabase = proxiquire('../', {
    './modelos/agent': () => AgentStub,
    './modelos/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.resetHistory()
})

test("Agent", t => {
  t.truthy(db.Agent, 'Agent service exists')
})

test.serial('Setup', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany has executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the model')
  t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo has executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument  should be the model')
})

test.serial('Agent#findById', async t => {
  let agent = await db.Agent.findById(id)

  t.true(AgentStub.findById.called, 'findById should be called on Model')
  t.true(AgentStub.findById.calledOnce, 'findById should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with id')
  t.deepEqual(agent, agentFixtures.byId(id), 'should be the same')
})

test.serial("Agent#CreateOrUpdate -  exists", async t => {
  let agent = await db.Agent.createOrUpdate(single)
  t.true(AgentStub.findOne.called, 'findOne is executed')
  t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(AgentStub.update.calledOnce, 'Update should be called once')
  t.deepEqual(agent, single, "agent should be the same")
})

test.serial("Agent#findAll#WithOutArgs", async t => {
  let agent = await db.Agent.findAll()

  t.true(AgentStub.findAll.called, "findAll should be called on model")
  t.true(AgentStub.findAll.calledOnce, "findAll should be called once")
})