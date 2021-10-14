var express = require('express')
var router = express.Router()
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const imagetoBase64 = require('../services/image/imagetoBase64')

router.post("/updateImage", async (req, res) => {
	if(req.body.image){
      		const image = await imagetoBase64(req.body.image)

		userUpdate = await prisma.user.update({
			where : {
				uuid: req.body.uuid
			},
			data: {
				image: image
			},
		})
		return res.send({
			message : "User Successfully updated",
			user : userUpdate,
		      })
	}
		else{
			res.status(401).send({message : "We need a new image to perfom this action"})
		}

})
