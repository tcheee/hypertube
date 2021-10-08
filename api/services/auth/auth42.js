require('dotenv').config()
const axios = require('axios')
const { resolveContent } = require('nodemailer/lib/shared')

const auth42 = async (code) => {
	try {
		const resp = await axios.post("https://api.intra.42.fr/oauth/token", {
			grant_type : "authorization_code",
			client_id: process.env.CLIENT_ID_42,
			client_secret: process.env.CLIENT_SECRET_42,
			code: code,
			redirect_uri: "http://localhost:3000/login",
		
	})
	const response = await  axios.get("https://api.intra.42.fr/v2/me", {
		headers : {
	      'Authorization': `Bearer ${resp.data.access_token}`
		}
	})
		user = {
			email : response.data.email,
			username: response.data.displayname,
			lastname: response.data.last_name,
			image : response.data.image_url,
			first_name : response.data.first_name,
			token : resp.data.access_token
		}
		return user 
	}
	catch (err){
		console.log(err)
		return (-1)
	}
	
}
module.exports = auth42