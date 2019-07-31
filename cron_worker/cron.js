var Redis = require('ioredis')
const Web3 = require('web3')

var redis = new Redis()
var web3 = new Web3(process.env.WEB3_PROVIDER)

let currentBlock
let startFrom
const init = async () => {
  // Initial Run
  currentBlock = await web3.eth.getBlockNumber()
  currentBlock = parseInt(currentBlock.toString())
  console.log(currentBlock)

  // Check db for latetst blockNumber and start from there.
  var result = await redis.get('last_block_mined')
  result = parseInt(result)
  if (!result) {
    startFrom = parseInt(currentBlock.toString()) - 10
    redis.set('last_block_mined', currentBlock)
  } else if (result && result == currentBlock) {
    console.log('<<< No New Block To Mine >>>')
    await redis.quit()
    process.exit(0)
  } else if (result && result < currentBlock) {
    redis.set('last_block_mined', currentBlock)
    startFrom = result
  }

  for (let i = startFrom; i <= currentBlock; i++) {
    if (i == currentBlock) {
      currentBlock = await web3.eth.getBlockNumber()
      currentBlock = parseInt(currentBlock.toString())
    }
    redis.set('last_block_mined', i)
    const txnCount = await web3.eth.getBlockTransactionCount(i)

    var redVal = await redis.get('last_txn_count')
    var startPoint = redVal && result == i ? parseInt(redVal) + 1 : 0

    for (let j = startPoint; j < txnCount; j++) {
      let txn
      try {
        txn = await web3.eth.getTransactionFromBlock(i, j)
        redis.set('last_txn_count', j)
      } catch (x) {
        console.error(x)
        await redis.quit()
        process.exit(0)
      }

      console.log({
        BlockNumber: i,
        from: txn.from,
        to: txn.to,
        ransactionHash: txn.hash
      })
    }
  }
  await redis.quit()
  process.exit(0)
}
try {
  init()
} catch (ex) {
  console.error(ex)
  process.exit(0)
}
process
  .on('SIGINT', async () => {
    console.log('>>>>>>>')
    await redis.quit()
    process.exit(0)
  })
  .on('SIGTERM', async () => {
    console.log('<<<<<<<')
    await redis.quit()
    process.exit(0)
  })
