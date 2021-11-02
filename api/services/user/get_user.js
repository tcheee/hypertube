const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()



async function getUser(id){
	const user = await prisma.user.findUnique({
		where: {
		  uuid: id,
		},
	      })
	return user
}

module.exports = getUser