const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


async function isDownloadMovie(id){
	const movie = await prisma.movies.findUnique({
	where: {
	   movieId: id,	
	},
})
	return movie.isDownload
}

module.exports = isDownloadMovie;