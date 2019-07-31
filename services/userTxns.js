'use strict'

module.exports = function (fastify, opts, next) {
  fastify.get('/', function (request, reply) {
    reply.send('this is an example')
  })

  next()
}
