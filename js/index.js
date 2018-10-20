$(document).ready(function(){
	var user = firebase.auth().currentUser;
	
	if(!user) {
		//redirect;
		return
	}
	
});