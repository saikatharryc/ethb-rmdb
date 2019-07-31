const fp = require("fastify-plugin");
const Bull = require("bull");

const env = process.env.NODE_ENV;
const removeOnComplete = true;
let bullPrefix = "bull-default";

if (env === "production") {
    bullPrefix = "{bull-production}";
} else if (env === "staging") {
    bullPrefix = "{bull-staging}";
} else if (env === "test") {
    bullPrefix = "{bull-test}";
}  else {
    bullPrefix = "{bull-development}";
}

module.exports = fp(function(fastify, opts, next) {
    const bullSystem = {};

    bullSystem.initBull = function() {
        console.log(
            "Bull redis",
            `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${
                process.env.REDIS_PORT
            } @ ${bullPrefix}`
        );
        const Queue = new Bull(
            "dataQueue",
            `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${
                process.env.REDIS_PORT
            }`,
            { prefix: bullPrefix }
        );
        bullSystem.bullDataJobs = Queue;

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
                backoff: { type: "fixed", delay: backOffDelay },
                delay,
                timeout,
                removeOnComplete,
                jobId
            };
            return Queue.add(name, data, jobOptions);
        };

        Queue.on("waiting", data => {
            // console.log(data);
        });
        Queue.on("error", error => {
            console.log("Bull error", error);
        });

        Queue.on("active", job => {
            // log worker start
            // console.log("Worker active", job);
        });

        Queue.on("completed", (job, result) => {
            // log worker completed
            // console.log("Worker completed", job);
        });

        Queue.on("failed", (job, err) => {
            // log worker failed
            console.log("Bull worker failed", job, err);
        });

        bullSystem.startBullWorkers = function(system) {
            if (bullSystem.bullEmailJobs) {
                console.info("++++Starting Bull Workers++++");
                require("./workers")(system);
            }
        };

        bullSystem.startBullWorkers(bullSystem);
    };

    bullSystem.initBull();
    fastify.decorate("bullSystem", bullSystem);

    next();
});
