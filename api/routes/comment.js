var express = require('express')
var router = express.Router()
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const getCommentsMovie = require('../services/comment/getCommentsMovie')
const createComment = require('../services/comment/createComment')

router.get('/comments', async (req, res) => {
    const comments = await prisma.comment.findMany()
    return res.send({
      message: "Works as expected",
      comments : comments
    })
  });

router.get('/commentsId', async (req, res) => {
  if(req.body.id){
    const comment = await prisma.comment.findUnique(
      {
        where : {
          id : req.body.id
        }
      }
    )
    return res.send({
      comment : comment
    })
  }
  else 
    return res.status(401).send({
    message: "We must have an Id"
  })
})

router.post('/addComment', async (req, res) => {
  console.log('Comment created')
  console.log(req.body)
  if(req.body.comment){
    const resultCreation = await createComment(req.body.movieId, req.body.comment, req.body.userId)
    const resultGetComment = await getCommentsMovie(req.body.movieId)

    return res.send({
      success: resultCreation.success,
      comments: resultGetComment.comments,
    })
  }
  else
    return res.status(401).send({
      message: "Something bad happened, Please try again"
    })
})

router.get('/getCommentsMovie', async (req, res) => {
  if (req.query.movieId) {
    const result = await getCommentsMovie(req.query.movieId)

    return res.send(result)
  }
  else
    return res.status(401).send({
      message: "Something bad happened, Please try again"
    })
  })


router.delete('/commentsId', async (req, res) => {
  if(req.body.id){
    await prisma.comment.delete(
      {
        where : {
          id : req.body.id
        },
      }
    )
    return res.send({
      message : "Comment deleted"
    })
  }
  else 
    return res.status(401).send({
    message: "We must have an Id"
  })
})

module.exports = router