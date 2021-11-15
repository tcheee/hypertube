var express = require('express')
var router = express.Router()
const axios = require('axios')
const createUser = require('../services/user/create_user.js')
const loginUser = require('../services/user/login_user')
const getOrCreateGoogle = require('../services/user/get_or_create_google')
const checkToken = require('../services/auth/check-token')
const getUser = require('../services/user/get_user')
const getAllUser = require('../services/user/get_all_user')
const resetPassword = require('../services/user/reset_password')
const resend_password = require('../services/user/reset_password')
const updateUser = require('../services/user/update_user')
const auth42 = require('../services/auth/auth42')
const getOrCreate42 = require('../services/user/get_or_create_42')
const imagetoBase64 = require('../services/image/imagetoBase64')
const jwt = require("jsonwebtoken");
const updateImage = require('../services/image/updateImage')
require('dotenv').config()

// Middleware
const authMiddleware = async (req, res, next) => {
  if(req.body.provider && req.body.secret && req.body.uuid){
    if(req.body.provider === "google"){
      await axios.post('https://oauth2.googleapis.com/tokeninfo?id_token=' + req.body.token)
      .then((response) => {
        if(response.status === 200)
          next();
      }).catch((error) => {
        console.log(error)
        res.status(401).send({message : error })
      })
    }
    if(req.body.provider === "42"){
      await  axios.get("https://api.intra.42.fr/v2/me", {
        headers : {
            'Authorization': `Bearer ${req.body.token}`
        }
    }).then((response) => {
      if(response.status === 200)
        next();
    }).catch((error) => {
      res.status(401).send({message : error })
   })
  }
    if(req.body.provider === "hypertube"){
      const result = await jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET)
      console.log(x)
      if(result.uuid === req.body.uuid){
        next()
      }
      else{
        res.status(401).send({message : "Middleware Auth Error, Please Sign in Again"})
    }
  }
  }
  else{
    res.status(401).send({message: "You must provide an access token and the provider in order to access these ressources"})
  }
  }

router.get('/', (req, res) => {
    res.json({msg: "all good, working as expected"});
  });

router.post('/login', async (req, res) => {
  if(req.body.user){
    const result = await loginUser(req.body.user)
    if(result != "-1"){
      return res.send({
        result: true,
        message: "User Successfully login",
        accesstoken: result[0],
        user: result[1],
        provider: "hypertube",
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
      result: true,
      message: "User Successfully created",
    });
  }
  else 
    return res.status(401).send({
      message: "Something bad happened, Please try again"
    })
})

router.post('/42auth', async (req, res) => {
  if(req.body.code){
    response = await auth42(req.body.code)
    if(response !== -1){
      const image = await imagetoBase64(response.image, false)
      user = await getOrCreate42(response, image)
      return res.send({
        message : "User Successfully login",
        user : user,
        provider : 42,
      })
    }
    else {
    return res.status(401).send({
    message: "42 authorization code is not valid"
  })}
  }
  else {
    return res.send(401).send({
      message: "We need a 42 authorization code"
    })
  }
})


router.post('/googleauth', async (req, res) => {
    const imagebase64 = await imagetoBase64(req.body.user.image, false)
    if(imagebase64 !== -1){
      const user = await getOrCreateGoogle(req.body.user.email, req.body.user.username, imagebase64)
      console.log(user)
      return res.send({
        provider: "google",
        user : user,
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

router.get('/userId', async (req, res) => {
  console.log(req.query)
  //console.log(res)
  if(req.query.id){
    const user = await getUser(req.query.id)
    return res.send({
      user : user
    })
  }
  else 
    return res.status(401).send({
    message: "We must have an Id"
  })
})

router.post('/resetpassword', async (req, res) => {
  if(req.body.id && req.body.password){
    await resetPassword(req.body.id, req.body.password)
    return res.send({
      message : "Password successfully reset"
    })
  }
  else 
    return res.status(401).send({
    message: "We must have an Id & Password"
  })
})

router.post('/forgetPassword', async (req, res) => {
  if(req.body.user){
    x = await resend_password(req.body.user.email)
    if (x == 0){
      return res.send({
      message : "Email successfully send"
    })
   }
  else{ 
    return res.status(401).send({
    message: "We must have a correct Email"
  })}
  }})

router.patch('/updateUser', async (req, res) => {
  if(req.body.user){
      userUpdate = await updateUser(req.body.user)
      return res.send({
        message: "User successfully patch",
        user: userUpdate
      })
  }
  else 
    return res.status(401).send({
    message: "We must have a User"
  })
})

router.post('/updateimage', async (req, res) => {
	console.log("Pass")
	console.log(req.body.image[0].path)
	console.log(req.body.uuid)
  if(req.body.image){
		res = await updateImage(req.body.image[0].path, req.body.uuid)
		if(res !== -1){
			return res.send({
				message : "User Successfully updated",
				user :res,
		})
	}}
		else{
			res.status(401).send({message : "We need a new image to perfom this action"})
		}
})

module.exports = router