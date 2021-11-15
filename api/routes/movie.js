var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/addMovie', async (req, res) => {
  console.log(req.body);
  const date = Date.now();

  if (req.body.hash) {
    await prisma.movies.upsert({
      where: { hash: req.body.hash },
      update: { lastTimewatch: date },
      create: {
        hash: req.body.hash,
        movieId: req.body.movieId,
        resolution: req.body.resolution,
        image_link: req.body.image_link,
        lastTimewatch: date,
        isDownload: false,
        summary: req.body.summary,
        title: req.body.title,
        rating: req.body.rating,
        productionYear: req.body.productionYear,
      },
    });
    return res.status(200).send({
      result: true,
      message: 'Movie Created',
    });
  } else {
    return res.status(401).send({
      message: 'Something bad happened',
    });
  }
});

router.post('/updateMovie', async (req, res) => {
  if (req.body.movie) {
    await prisma.movies.update({
      where: {
        movieId: req.body.movie.movieId,
      },
      data: {
        resolution: req.body.movie.resolution,
        image_link: req.body.movie.image_link,
        lastTimewatch: req.body.movie.lastTimeWatch,
        isDownload: req.body.movie.isDownload,
        summary: req.body.summary,
        title: req.body.title,
        rating: req.body.rating,
        productionYear: req.body.productionYear,
      },
    });
    return res.send({
      message: 'Movie Updated',
    });
  } else
    return res.status(401).send({
      message: 'Something bad happened',
    });
});

router.get('/getOrCreateMovie', async (req, res) => {
  if (req.body.movieId) {
    const movie = await prisma.movies.findUnique({
      where: {
        movieId: req.body.movieId,
      },
    });
    return res.send({
      movie: movie,
    });
  } else
    return res.status(401).send({
      message: 'Something bad happened',
    });
});

router.get('/movieIsSeen', async (req, res) => {
  if (req.body.movieId) {
    const resp = await prisma.moviesSeen.findUnique({
      where: {
        MovieId: req.body.movieId,
        UserId: req.body.uuid,
      },
    });
    if (resp) {
      return res.send({ message: 'Movie is seen', Seen: true });
    } else {
      return res.send({ message: 'Movie not seen', Seen: false });
    }
  } else {
    return res.status(401).send({
      message: 'We need a MovieId to perform this action',
    });
  }
});

router.post('/setMovieSeen', async (req, res) => {
  try {
    if (req.body.movieId) {
      const watch = await prisma.moviesSeen.findMany({
        where: {
          movieid: req.body.movieId,
          userid: req.body.uuid,
        },
      });

      if (watch.length > 0 && watch[0]) {
        return res.send({
          message: 'Movies already seen',
        });
      }

      await prisma.moviesSeen.create({
        data: {
          movieid: req.body.movieId,
          userid: req.body.uuid,
        },
      });
      return res.send({
        message: 'Movies Seen Successfully created',
      });
    } else {
      return res.status(401).send({
        message: 'We need a MovieId to perform this action',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: 'Error while performing the action',
    });
  }
});

module.exports = router;
