const axios = require('axios')

// Remove email
const checkToken = async (token, provider, email) => {
	try {
		const resp = await axios.post('https://oauth2.googleapis.com/tokeninfo?id_token=' + token)
		if (resp.data.email === email){
			return true
	}
	}
	catch (err){
		console.log(err)
		return false
	}
	}

module.exports = checkToken