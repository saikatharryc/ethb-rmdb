const Bull = require('bull')

const env = process.env['NODE_ENV']
const removeOnComplete = true
let bullPrefix = 'bull-default'

if (env === 'production') {
  bullPrefix = '{bull-production}'
} else if (env === 'staging') {
  bullPrefix = '{bull-staging}'
} else if (env === 'test') {
  bullPrefix = '{bull-test}'
} else {
  bullPrefix = '{bull-development}'
}

const bullSystem = {}

bullSystem.initBull = function () {
  console.log(
    'Bull redis',
    `redis://${process.env['REDIS_HOST']}:${
      process.env['REDIS_PORT']
    } @ ${bullPrefix}`
  )
  const Queue = new Bull(
    'dataQueue',
    `redis://:${process.env['REDIS_PASS']}@${process.env['REDIS_HOST']}:${
      process.env['REDIS_PORT']
    }`,
    {
      prefix: bullPrefix
    }
  )

  bullSystem.bullDataJobs = Queue

  // Delay in ms
  bullSystem.addJob = (
    name,
    data,
    {
      attempts = 3,
      delay = 0,
      timeout = 120000,
      backOffDelay = 10000,
      jobId
    } = {}
  ) => {
    const jobOptions = {
      attempts,
      backoff: { type: 'fixed', delay: backOffDelay },
      delay,
      timeout,
      removeOnComplete,
      jobId
    }
    return Queue.add(name, data, jobOptions)
  }
}
bullSystem.initBull()

module.exports = { bullSystem }
