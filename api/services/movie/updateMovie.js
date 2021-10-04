const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


async function updateMovie(id){
	await prisma.movies.update({
	where: {
	   movieId: id,	
	},
	data : 
	  {
	    resolution: req.body.movie.resolution,
	    image_link: req.body.movie.image_link,
	    lastTimewatch: req.body.movie.lastTimeWatch,
	    isDownload: req.body.movie.isDownload,
	  }      
	})
}

module.exports = updateMovie;