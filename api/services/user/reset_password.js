const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const send_mail = require('./send_mail.js')
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

async function resend_password(email) {
	const user = await prisma.user.findUnique({
		where: {
		  email: email,
		},
	      })
        const id = user.id
        const first_name = user.firstname
        const content = "Hello " + user.firstname + ", you ask to reinitialize your password for Hypertube. Please click on this link to change your password : http://localhost:3000/reset-password?id=" + user.id // LOCAL
        const subject = "Hello, please follow the link to reset your password 👋👋👋"
        send_mail(user.email, subject, content);
        resolve(0)
}

module.exports = resend_password, resetPassword
