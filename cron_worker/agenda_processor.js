const Agenda = require("agenda");
const repetableJob = require("./cron");

const agenda = new Agenda({
    db: { address: process.env.MONGO_URI },
    collection: "agendaJobs"
});

agenda.define("run repetableJob", { priority: "high" }, async (job, done) => {
    try {
        const { status, stack } = await repetableJob();
        await agenda.schedule("in 5 minutes", "run repetableJob", {});
        if (!status) {
            done(stack);
        }
    } catch (ex) {
        done(ex);
    }
});
(async function() {
    // IIFE to give access to async/await
    await agenda.start();
    await agenda.schedule("in 0 minutes", "run repetableJob", {});
})();
module.exports = agenda;
