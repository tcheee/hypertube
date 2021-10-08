const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const axios = require("axios")


const getOrCreateGoogle = async (email, username, image) => {
  console.log("WTFFFFFFFFFFF")
	  await prisma.user.upsert({
          where: { email: email },
          update: {},
          create: { email: email, username : username, image : image },
        })
      }

module.exports  = getOrCreateGoogle