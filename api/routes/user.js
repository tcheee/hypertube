var express = require('express')
var router = express.Router()
//import { PrismaClient } from '@prisma/client'

//const prisma = new PrismaClient()

const getOrCreateGithub = async (email) => {
  console.log(email)
//  await prisma.user.upsert({
//    where: { email: email },
//    update: {},
//    create: { email: email },
//  })
}
const getOrCreateGoogle = async (email, username, image) => {
  console.log(email)
  console.log(username)
  console.log(image)
  //  await prisma.user.upsert({
//    where: { email: email },
//    update: {},
//    create: { email: email, username : username, image : image },
//  })
}
router.get('/', (req, res) => {
    res.json({msg: "all good, working as expected"});
  });

router.post('/githubauth', (req, res) => {
  console.log("la")
  if(req.body.user){
    getOrCreateGithub(req.body.user.email)
  }
})

router.post('/googleauth', (req, res) => {
  console.log("la")
  if(req.body.user){
    getOrCreateGoogle(req.body.user.email, req.body.user.username, req.body.user.image)
  }
})


module.exports = router