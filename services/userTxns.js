'use strict'

module.exports = function (fastify, opts, next) {
  fastify.get('/txns', {
    url: '/txns',
    method: 'GET',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          user_address: {
            type: 'string',
            minLength: 42
          },
          limit: {
            type: 'number'
          },
          skip: {
            type: 'number'
          }
        },
        required: ['user_address']
      }
    },
    handler: async (request, reply) => {
      const data = await fastify.getTransactions(
        request.query.user_address,
        request.query.limit,
        request.query.skip
      )
      return reply.send(data)
    }
  })

  next()
}
