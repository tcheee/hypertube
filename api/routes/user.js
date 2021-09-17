var express = require('express')
var router = express.Router()
const createUser = require('../services/user/create_user.js')
const loginUser = require('../services/user/login_user')
const getOrCreateGoogle = require('../services/user/get_or_create_user')
const getOrCreateGithub = require('../services/user/get_or_create_user')
const checkToken = require('../services/auth/check-token')
const getAllUser = require('../services/user/get_user')
const getUser = require('../services/user/get_user')

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

router.post('/googleauth', async (req, res) => {
  const tokenIsValid = await checkToken(req.body.user.token, "google", req.body.user.email)
  if(tokenIsValid){
    console.log(req.body)
    getOrCreateGoogle(req.body.user.email, req.body.user.username, req.body.user.image)
    return res.send({
      message: "User Successfully Login",
    });
}
else 
  return res.status(401).send({
    message: "Token is not valid"
  })
})

router.get('/users', async (req, res) => {
  const users = await getAllUser()
  return res.send({
    users : users
  })
})

router.get('/usersId', async (req, res) => {
  if(req.body.id){
    const user = await getUser(req.body.id)
    return res.send({
      user : user
    })
  }
  else 
  return res.status(401).send({
    message: "We must have an Id"
  })
})


module.exports = router