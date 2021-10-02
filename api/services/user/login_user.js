require('dotenv').config()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken");

async function loginUser(user){
	const userDb = await prisma.user.findUnique({
		where: {
		  email: user.email
		},
	});
	return new Promise((resolve, reject) => {
		if (userDb != null){
			console.log(userDb)
			bcrypt.compare(user.password, userDb.password, function(err, res) {
		if (err){
			  // handle econsole.log("PASSWORD BCRYPT FAIL")
			resolve(-1)
			}
		if (res) {
			const accesstoken = jwt.sign(userDb, process.env.ACCESS_TOKEN_SECRET)
			resolve([accesstoken, userDb]);
			  // Send JWT
			} else {
			  // response is OutgoingMessage object that server response http request
			  console.log("GET USER FAILED, USER NOT EXIST")
				resolve(-1)
			}
		      });
		}
})
}


module.exports = loginUser