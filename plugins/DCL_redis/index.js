'use strict'

const fp = require('fastify-plugin')

module.exports = fp(function(fastify, opts, next) {
    // get redis client object
    const {redis} = fastify
    //register the mailing service producer
    fastify.decorate('bullSystem', require('./bull'))

next();
})