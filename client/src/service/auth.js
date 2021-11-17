import firebase from "firebase/app";
import 'firebase/auth'

const socialMediaAuth = (provider) => {
	return firebase.auth().signInWithPopup(provider).then((res) => {
		return res;
	})
	.catch((er) => {
		return er;
	});
};

export default socialMediaAuth;