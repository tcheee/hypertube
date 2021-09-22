const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const resetPassword = async (id, password) => {
	password = await bcrypt.hash(password, saltRounds);
	await prisma.user.update({
		where: {
		  id: id,
		},
		data: {
		  password: password,
		},
	      })
}

module.exports = resetPassword