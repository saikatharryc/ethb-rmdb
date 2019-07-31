const Redis = require("ioredis");
const Web3 = require("web3");
if (!process.env.WEB3_PROVIDER) {
    require("dotenv").config();
}
const { bullSystem } = require("./bullSystem");

var redis = new Redis(
    `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${
        process.env.REDIS_PORT
    }`
);
var web3 = new Web3(process.env.WEB3_PROVIDER);

let currentBlock;
let startFrom;
const init = async done => {
    // Initial Run
    currentBlock = await web3.eth.getBlockNumber();
    currentBlock = parseInt(currentBlock.toString());
    console.log(currentBlock);

    // Check db for latetst blockNumber and start from there.
    var result = await redis.get("last_block_mined");
    result = parseInt(result);
    if (!result) {
        startFrom = parseInt(currentBlock.toString()) - 10;
        redis.set("last_block_mined", currentBlock);
    } else if (result && result == currentBlock) {
        console.log("<<< No New Block To Mine >>>");
        await redis.quit();
        done("<<< No New Block To Mine >>>");
    } else if (result && result < currentBlock) {
        redis.set("last_block_mined", currentBlock);
        startFrom = result;
    }

    for (let i = startFrom; i <= currentBlock; i++) {
        if (i == currentBlock) {
            currentBlock = await web3.eth.getBlockNumber();
            currentBlock = parseInt(currentBlock.toString());
        }
        redis.set("last_block_mined", i);
        const txnCount = await web3.eth.getBlockTransactionCount(i);

        var redVal = await redis.get("last_txn_count");
        var startPoint = redVal && result == i ? parseInt(redVal) + 1 : 0;

        for (let j = startPoint; j < txnCount; j++) {
            let txn;
            try {
                txn = await web3.eth.getTransactionFromBlock(i, j);
                const jobData = {
                    blockNumber: i,
                    from: txn.from,
                    to: txn.to,
                    transactionHash: txn.hash
                };
                console.log(jobData);
                await bullSystem.addJob("data", jobData);
                redis.set("last_txn_count", j);
            } catch (x) {
                console.error(x);
                await redis.quit();
                done(x);
            }
        }
    }
    return true;
};
module.exports = init;
