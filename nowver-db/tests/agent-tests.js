"use stric"

const test = require("ava")
const proxiquire = require("proxyquire")
const sinon = require("sinon")

let db = null;
let sandbox = null
let config = {
  logging: function () { }
}

let MetricStub = {
  belongsTo: sinon.spy()
}

let AgentStub = null

test.before(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }
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