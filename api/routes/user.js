var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const createUser = require('../user/create_user.js')
const loginUser = require('../user/login_user')
const getOrCreateGoogle = require('../user/get_or_create_user')
const getOrCreateGithub = require('../user/get_or_create_user')

router.get('/', (req, res) => {
    res.json({msg: "all good, working as expected"});
  });

router.post('/login', async (req, res) => {
  console.log("LOGIN TRY")
  if(req.body.user){
    const result = await loginUser(req.body.user)
    console.log(result)
    if(result != "-1"){
      return res.send({
        message: "User Successfully login",
        accesstoken: result
      })
    }
    else{
      return res.status(401).send({
        message: "Email or Password Incorrect"
      })
    }
  }
  else{
    return res.status(401).send({
      message: "Something bad happened, Please try again"
    })
  }
}),


router.post('/hypertubeauth', async (req, res) => {
  if(req.body.user){
    console.log(req.body.user)
    // Call Create User fonction
    await createUser(req.body.user)
    return res.send({
      message: "User Successfully created",
   //   accessToken: accesstoken
    });
  }
  else 
    return res.status(401).send({
      message: "Something bad happened, Please try again"
    })
})

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