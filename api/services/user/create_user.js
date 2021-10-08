require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken");

async function createUser(user){
	password = await bcrypt.hash(user.password, saltRounds);

	const x = await prisma.user.create({
	  data : {
	    email : user.email,
	    password : password,
	    username : user.userName,
	    firstname : user.firstName,
	    lastName : user.lastName,
	  }
	})
}

module.exports = createUser;