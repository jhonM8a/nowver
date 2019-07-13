'use strict'

const setupDatabase = require('./lib/db')
const setupAgent = require('./modelos/agent')
const setupMetric = require('./modelos/metric')

module.exports = async function (config) {
  const sequelize = setupDatabase(config);
  const AgentModel = setupAgent(config)
  const MetricModel = setupMetric(config)

  /** Se define la relación entre agentes y metricas*/
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequelize.authenticate()

  if (config.setup) {
    /**Crea la base de datos, y si existe una la bprra y la ceea */
    await sequelize.sync({ force: true })
  }
  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
