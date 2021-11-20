const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getOrCreate42 =  async (user42, image) => {
	user = await prisma.user.upsert({
		where: { email: user42.email },
		update: {},
		create: { 
			email: user42.email, 
			username : user42.username, 
			image : image, 
			lastname : user42.lastname, 
			firstname : user42.firstname},
	      })
	      return user;
	    }

module.exports  = getOrCreate42