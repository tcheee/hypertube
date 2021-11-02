const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


async function getAllUser(){
	const users = await prisma.user.findMany()
	return users
}

module.exports = getAllUser