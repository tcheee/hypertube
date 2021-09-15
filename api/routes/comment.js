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