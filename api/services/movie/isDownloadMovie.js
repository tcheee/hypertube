const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function isDownloadMovie(hash) {
  const movie = await prisma.movies.findUnique({
    where: {
      hash: hash,
    },
  });
  return movie.isDownload;
}

module.exports = isDownloadMovie;
