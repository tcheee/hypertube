const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


const getOrCreateGoogle = async (email, username, image) => {
	const res = await prisma.user.upsert({
          where: { email: email },
          update: {},
          create: { email: email, username : username, image : image },
        })
        return res
      }

module.exports  = getOrCreateGoogle