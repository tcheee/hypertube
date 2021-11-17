import firebase from "firebase/app";
import 'firebase/analytics';
import 'firebase/auth';
const firebaseConfig = {
	apiKey: "AIzaSyAJKsBTdIhiap4N_TFlOCHDZnTLVstIzdc",
	authDomain: "hypertube-4e9e0.firebaseapp.com",
	projectId: "hypertube-4e9e0",
	storageBucket: "hypertube-4e9e0.appspot.com",
	messagingSenderId: "499381975770",
	appId: "1:499381975770:web:29cec719bb4ff15879c3e3",
	measurementId: "G-J71EJ3954V"
      };

firebase.initializeApp(firebaseConfig)
firebase.analytics();

export default firebase;