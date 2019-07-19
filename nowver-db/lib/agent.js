'use stric'

module.exports = function setupAgent(AgentModel) {
    function findById(id) {
        return AgentModel.findById(id)
    }

    async function createOrUpdate(agent) {
        const cond = {
            where: {
                uuid: agent.uuid
            }
        }
        const existingAgent = await AgentModel.findOne(cond)

        if (existingAgent) {
            const update = await AgentModel.update(agent, cond)
            return update ? AgentModel.findOne(cond) : existingAgent
        }

        const result = await AgentModel.create(agent)
        return result.toJSON()
    }
    return { findById, createOrUpdate }
}