const cron = require('node-cron');

function scheduleDeletion() {
    cron.schedule('* 8 1 * *', () => {
        console.log('running a task every minute');

        //
        // go and select in the db where the 'last_seen_date' est >= 1 month and put the path in an array
        // loop the array and delete the movies in the fs.unlin here: https://www.geeksforgeeks.org/node-js-fs-unlink-method/
        // put the info
      });
}

module.exports = scheduleDeletion