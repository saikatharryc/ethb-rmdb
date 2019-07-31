const assert = require('assert')

let Schema = ''

function init () {
  const txnSchema = new Schema(
    {
      from: {
        type: String,
        default: ''
      },
      to: {
        type: String,
        default: ''
      },
      blockNumber: {
        type: String,
        default: ''
      },
      transactionHash: {
        type: String,
        default: ''
      }
    },
    {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    }
  )

  return txnSchema
}

module.exports = schema => {
  assert.ok(schema)
  Schema = schema
  return init()
}
