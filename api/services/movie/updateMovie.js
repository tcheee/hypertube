const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setDownloadedMovie(id) {
  try {
    await prisma.movies.update({
      where: {
        movieId: id,
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
