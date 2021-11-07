const imageToBase64 = require('image-to-base64');

const imagetoBase64 = async (url) => {
	try {
		console.log("THIS IS " + url)
		resp = await imageToBase64(url) // Path to the image
		return resp
	}
	catch(err){
		console.log(err)
		return(-1) // Logs an error if there was one
	    }
	}
module.exports = imagetoBase64