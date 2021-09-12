const axios = require('axios')

const checkToken = async (token, provider, email) => {
	if (provider === "google"){
	axios.post('https://oauth2.googleapis.com/tokeninfo?id_token=' + token)
	.then(response => {
	  console.log(response.data);
	  console.log(response.data.email)
	  console.log(email)
	  if(response.data.email === email)
		return true
	})
	.catch(error => {
	  console.log(error)
	  return false
	})
	}
	if (provider === "github"){

	}
}

module.exports = checkToken