const imageToBase64 = require('image-to-base64');
const fs = require('fs');
const path = require('path')
const readlink = require('readlink')
const imagetoBase64 = async (url, isPath) => {
	try {
		if(isPath){
			readlink( url, (err, path) => {
				console.log("GOOD PATH" + path) // /tmp/bar/baz/file
			      })
		}
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