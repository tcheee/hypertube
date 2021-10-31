const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const updateUser = async (user) => {
	userUpdate = await prisma.user.update({
		where: {
		  uuid: user.uuid,
		},
		data: {
		  firstname : user.firstname,
		  lastName : user.lastName,
		  username: user.username,
		  comments: user.comments,
		  language: user.language,
		  image: user.image,
		},
	})
	return userUpdate
}

module.exports = updateUser