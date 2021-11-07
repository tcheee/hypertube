const imagetoBase64 = require('../image/imagetoBase64')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const updateImage = async (image, uuid) => {
	try {
		const imagebase64 = await imagetoBase64(image)
		userUpdate = await prisma.user.update({
			where : {
				uuid: uuid
			},
			data: {
				image: imagebase64
			},
		})
		return userUpdate
	}
	catch(err){
		console.log(err)
		return(-1) // Logs an error if there was one
	    }
}

module.exports = updateImage