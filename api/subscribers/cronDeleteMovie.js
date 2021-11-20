const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { findSync } = require('@prisma/client/runtime');
const prisma = new PrismaClient();
const path = require('path');
const appDir = path.dirname(require.main.filename);
const fs = require('fs');

function scheduleDeletion() {
  cron.schedule('* 8 1 * *', async () => {
    const lastTime = Date.now() - 2592000000;

    const movies = await prisma.movies.findMany({
      where: {
        lastTimewatch: {
          lt: lastTime,
        },
      },
    });

    movies.forEach((movie) => {
      if (fs.existsSync(appDir + '/tmp/movies/' + movie.hash + '.mp4')) {
        fs.rmSync(appDir + '/tmp/movies/' + movie.hash + '.mp4');
      }
    });
  });
}

module.exports = scheduleDeletion;
