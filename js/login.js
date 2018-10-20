$(document).ready(function(){
	var user = firebase.auth().currentUser;
	
	if(user) {
		//redirect;
		return
	}
	
	
	$(document).on("click", "#registrationButton", function(){
		
		
		firebase.auth().onAuthStateChanged(function(user) {
			if (!user) {
				var email = $("#RegistrationInputEmail").val();
				var password = $("#RegistrationInputPassword").val();
				firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {		
					var errorCode = error.code;
					var errorMessage = error.message;		
				});
			}
		});
		
		
	});
	
	$(document).on("click", "#loginBtn", function(){
		
	});
	
	$(document).on("click", "#emailRememberButton", function(){
		var auth = firebase.auth();
		var emailAddress = $("#emailRemember").val();
		
		auth.sendPasswordResetEmail(emailAddress).then(function() {
			console.log("ok");
		}).catch(function(error) {
			console.log(error)
		});
		
		
	});
	
});