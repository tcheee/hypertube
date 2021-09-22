var express = require('express')
var router = express.Router()
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


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

router.post('/commentsAdd', async (req, res) => {
  if(req.body.comments){
    await prisma.comment.create({
      data : 
      {
        moviesId : req.body.comments.moviesId,
        comment: req.body.comments.comment,
        fromId: req.body.comments.fromId,
      }      
    })
    return res.send({
      message: "comment Created"
    })
  }
  else
    return res.status(401).send({
      message: "Something bad happened, Please try again"
    })
})

router.get('/getCommentsMovie', async (req, res) => {
  if (req.body.movieId){
    comments = await prisma.comments.findMany({
      where : {
        moviesId : req.body.movieId
      }
    })
    return res.send({
      comments: comments
    })
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
        }
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