const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setDownloadedMovie(hash) {
  try {
    await prisma.movies.update({
      where: {
        hash: hash,
      },
      data: {
        isDownload: true,
      },
    });
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = setDownloadedMovie;
