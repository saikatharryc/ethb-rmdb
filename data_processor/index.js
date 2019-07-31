const { models } = require('../plugins/DCL_mongo/connection')
module.exports = bullSys => {
  const dataProcessor = (job, done) => {
    try {
      console.log(job.data)
      models.transactions
        .create(job.data)
        .then(d => {
          console.log(d)
          done()
        })
        .catch(ex => {
          console.log(ex)
          done(ex)
        })
    } catch (tlx) {
      done(tlx)
    }
  }

  bullSys.bullDataJobs.process('data', dataProcessor)
}
