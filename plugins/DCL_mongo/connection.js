const mongoose = require('mongoose')
if (!process.env['MONGO_URI']) {
    // load the environment variables
    require('dotenv').config()
}
const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    user: process.env['MONGO_USER'],
    pass: process.env['MONGO_PASS'],
}

// connect
//mongoose.connect('mongodb://127.0.0.1/cretanium', options)
mongoose.connect(process.env['MONGO_URI'], options).catch(e => {
    fastify.log.error('Could not connect to mongo', e)
})

// get database
const db = mongoose.connection

// define schema

const txnSchema = require('./models/transactions')(mongoose.Schema)

// compile models
const txnModel = mongoose.model('transaction', txnSchema)

module.exports = {
    db: db,
    models: {
        transactions: txnModel,
    },
}
