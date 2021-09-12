const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const getOrCreateGoogle = async (email, username, image) => {
	  await prisma.user.upsert({
          where: { email: email },
          update: {},
          create: { email: email, username : username, image : image },
        })
      }

      const getOrCreateGithub = async (email) => {
        await prisma.user.upsert({
          where: { email: email },
          update: {},
          create: { email: email },
        })
      }      

module.exports  = getOrCreateGoogle, getOrCreateGithub