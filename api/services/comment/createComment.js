const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const createComment = (movieId, comment, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const creation = await prisma.comment.create({
                data : 
                {
                  movieId: movieId,
                  comment: comment,
                  fromId: userId,
                }      
              })
            resolve({success: true, comments: creation});
        } catch(err) {
            resolve({success: false, err: err})
        }
    })
}

module.exports = createComment;