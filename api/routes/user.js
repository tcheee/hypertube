var express = require('express')
var router = express.Router()
const createUser = require('../services/user/create_user.js')
const loginUser = require('../services/user/login_user')
const getOrCreateGoogle = require('../services/user/get_or_create_google')
const checkToken = require('../services/auth/check-token')
const getAllUser = require('../services/user/get_user')
const getUser = require('../services/user/get_user')
const resetPassword = require('../services/user/reset_password')
const resend_password = require('../services/user/reset_password')
const updateUser = require('../services/user/update_user')
const auth42 = require('../services/auth/auth42')
const getOrCreate42 = require('../services/user/get_or_create_42')
const imagetoBase64 = require('../services/image/imagetoBase64')


router.get('/', (req, res) => {
    res.json({msg: "all good, working as expected"});
  });

router.post('/login', async (req, res) => {
  console.log("LOGIN TRY")
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
      const image = await imagetoBase64(response.image)
      await getOrCreate42(response, image)
      return res.send({
        message : "User Successfully login",
        user : response,
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
    const imagebase64 = await imagetoBase64(req.body.user.image)
    console.log("IMAGE IS" + imagebase64)
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

router.post('/user/image', async (req, res) => {
  console.log(req.body)
  // store image in base64 and store in db
  return (true);
  // const users = await getAllUser()
  // return res.send({
  //   users : users
  // })
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


module.exports = router