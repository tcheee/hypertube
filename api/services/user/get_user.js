const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function getAllUser(){
	const users = await prisma.user.findMany()
//	console.log(users)
	return users
}

async function getUser(id){
	const user = await prisma.user.findUnique({
		where: {
		  id: id,
		},
	      })
//	console.log(user)
	return user
}

module.exports = getAllUser