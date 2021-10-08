require('dotenv').config()
const axios = require('axios')

// Remove email
const auth42 = async (code) => {
	console.log(code)
	axios.post("https://api.intra.42.fr/oauth/token", {
		grant_type : "authorization_code",
		client_id: process.env.CLIENT_ID_42,
		client_secret: process.env.CLIENT_SECRET_42,
		code: code,
		redirect_uri: "http://localhost:3000/login",
	}).then((response) => {
		console.log("token is " + response.data.access_token);
		axios.get("https://api.intra.42.fr/v2/me", {
			headers : {
		      'Authorization': `Bearer ${response.data.access_token}`
			}
	      }).then((response) => {
		      console.log(response.data.email)
		 //     return (response.data.access_token);
		    }).catch((err) => {
			    console.log(err)
			    return (-1)
		    })
	      }).catch((err) => {
		      return (-1)
	      })
	}

module.exports = auth42