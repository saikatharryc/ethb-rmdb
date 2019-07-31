'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function (fastify, opts, next) {
  // register the mailing service producer

  fastify.decorate('bullSystem', require('./bull').bullSystem)
  next()
})
