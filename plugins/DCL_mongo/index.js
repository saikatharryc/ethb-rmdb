/* Data Access Layer - creates mongoose instance and exposes database object globally using decorator */

'use strict'

const fp = require('fastify-plugin')
const { db, models } = require('./connection')
// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(
  function (fastify, opts, next) {
    db.once('open', function () {
      fastify.log.info('mongo connection OK')
      fastify.decorate('mongo', {
        ...{ db, models }
      })
    })
    next()
  },
  {
    name: 'cewl-mongodb-plugin'
  }
)
