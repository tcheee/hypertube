const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const updateUser = async (user) => {
	userUpdate = await prisma.user.update({
		where: {
		  uuid: user.uuid,
		},
		data: {
		  firstname : user.firstname,
		  lastname : user.lastname,
		  username: user.username,
		  language: user.language,
		},
	})
	return userUpdate
}

module.exports = updateUser