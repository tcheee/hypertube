const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isWatchedMovie = async (uuid, imdb) => {
  if (!uuid) {
    return false;
  }

  const movie = await prisma.moviesSeen.findMany({
    where: {
      movieid: imdb,
      userid: uuid,
    },
  });

  if (movie.length > 0 && movie[0].id) {
    return true;
  } else {
    return false;
  }
};

module.exports = isWatchedMovie;
