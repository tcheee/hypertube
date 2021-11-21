const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
require('dotenv').config()
const send_mail = require('./send_mail.js')

async function resend_password(email) {
	console.log("pass")
	console.log(email)
	const user = await prisma.user.findUnique({
		where: {
		  email: email,
		},
	      })
	if(user !== null){
	console.log(user)
        const content = "Hello " + user.firstname + ", you ask to reinitialize your password for Hypertube. Please click on this link to change your password : http://localhost:3000/change-password/" + user.uuid // LOCAL
        const subject = "Hello, please follow the link to reset your password 👋👋👋"
        send_mail(user.email, subject, content);
        return(0)
	}
	else
		return(-1)
	}

module.exports = resend_password
