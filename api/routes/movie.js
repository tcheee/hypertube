var express = require('express')
var router = express.Router()
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

router.post('/addMovie', async (req, res) => {
	console.log('we are adding a movie')
	console.log(req.body)
	const date = Date.now();

	if(req.body.hash) {
		const result = await prisma.movies.upsert({
			where:{ hash: req.body.hash},
			update: { lastTimewatch: date},
			create: {
				hash: req.body.hash,
				movieId : req.body.movieId,
				resolution: req.body.resolution,
				image_link: req.body.image_link,
				lastTimewatch: date,
				isDownload: false
			}    
		})

		console.log(result)

		return res.status(200).send({
			result: true,
			message: "Movie Created",
		  })
	}
	else {
		return res.status(401).send({
			message: "Something bad happened"
		})
	}
})

router.post('/updateMovie', async (req, res) => {
	if(req.body.movie){
		await prisma.movies.update({
		where: {
		   movieId: req.body.movie.movieId,	
		},
		data : 
		  {
		    resolution: req.body.movie.resolution,
		    image_link: req.body.movie.image_link,
		    lastTimewatch: req.body.movie.lastTimeWatch,
		    isDownload: req.body.movie.isDownload,
		  }      
		})
		return res.send({
		  message: "Movie Updated"
		})
	}
	else
		return res.status(401).send({
			message: "Something bad happened"
		})
      })

router.get('/getOrCreateMovie', async (req, res) => {
	if(req.body.movieId){
		const movie =  await prisma.movies.findUnique({
		  where : 
		  {
		    movieId : req.body.movie.movieId,
		  }      
		})
		return res.send({
		  movie : movie
		})
	}
	else
		return res.status(401).send({
			message: "Something bad happened"
		})
      })

module.exports = router;