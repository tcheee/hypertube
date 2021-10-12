const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getOrCreate42 =  async (user42, image) => {
//	var imageAsBase64 = fs.readFileSync(user42.image, 'base64');
	console.log(user42)
	await prisma.user.upsert({
		where: { email: user42.email },
		update: {},
		create: { 
			email: user42.email, 
			username : user42.username, 
			image : image, 
			lastname : user42.lastname, 
			firstname : user42.firstname},
	      })
	    }

module.exports  = getOrCreate42