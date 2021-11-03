const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCommentsMovie = (movieId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          movieId: movieId,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
        select: {
          id: true,
          comment: true,
          from: {
            select: {
              username: true,
            },
          },
        },
      });
      resolve({ success: true, comments: comments });
    } catch (err) {
      resolve({ success: false, err: err });
    }
  });
};

module.exports = getCommentsMovie;
