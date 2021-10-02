const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const updateUser = async (user) => {
	userUpdate = await prisma.user.update({
		where: {
		  id: user.id,
		},
		data: {
		  firstname : user.firstname,
		  lastName : user.lastName,
		  username: user.username,
		  comments: user.comments,
		},
	})
	return userUpdate
}

module.exports = updateUser