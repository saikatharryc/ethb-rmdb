'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp((fastify, opts, next) => {
  fastify.decorate('getTransactions', async (userAddress, limit, skip) => {
    const result = await fastify.mongo.models.transactions
      .find(
        {
          $or: [{ to: userAddress }, { from: userAddress }]
        },
        '-created_at -updated_at'
      )
      .limit(limit || 10)
      .skip(skip || 0)
    return result
  })
  next()
})
