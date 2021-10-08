const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getOrCreate42 =  async (user42) => {
	await prisma.user.upsert({
		where: { email: user42.email },
		update: {},
		create: { 
			email: user42.email, 
			username : user42.username, 
			image : user42.image, 
			lastname : user42.last_name, 
			firstname : user42.first_name},
	      })
	    }

module.exports  = getOrCreate42