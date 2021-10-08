const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const axios = require("axios")

const getOrCreate42 =  (token) => {
	console.log("token is" + token)
	axios.get("https://api.intra.42.fr/v2/me", {
		      Authorization : "Bearer" + token,
	      }).then((response) => {
		      console.log("response is" + response);
		 //     return (response.data.access_token);
		    }).catch((err) => {
			    return (-1)
		    })
	      }

module.exports  = getOrCreate42