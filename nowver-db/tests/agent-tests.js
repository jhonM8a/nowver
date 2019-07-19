"use stric"

const test = require("ava")
const proxiquire = require("proxyquire")
const sinon = require("sinon")
const agentFixtures = require('./fixtures/agent')

let db = null;
let sandbox = null
/**Para tener instancias por aparte del fixtures */
let single = Object.assign({}, agentFixtures.single)
let id = 1
let config = {
  logging: function () { }
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
  AgentStub.findById = sandbox.stub();
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))

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