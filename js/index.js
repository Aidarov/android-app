function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


$(document).ready(function(){
	var user = firebase.auth().currentUser;
	
	if(!user) {
		//redirect;
		//return
	}
	
	$(window).on('hashchange',function(){ 
		console.log(location.hash.slice(1));
		$(".content").css("display", "none");
		$("#"+location.hash.slice(1)).css("display", "inline");
	});
	
	function getFormattedData(unix_timestamp){
		var d = new Date(unix_timestamp * 1000);
		
		var formatted_date = ("00" + (d.getMonth() + 1)).slice(-2) + "/" + 
		("00" + d.getDate()).slice(-2) + "/" + 
		d.getFullYear() + " " + 
		("00" + d.getHours()).slice(-2) + ":" + 
		("00" + d.getMinutes()).slice(-2) + ":" + 
		("00" + d.getSeconds()).slice(-2);
		
		return formatted_date;
	}
	
	
	
	
	
	
	
	
	firebase.database().ref("products").on("value", function(snapshot){
		
		$("#product_list_table").find("tr:gt(0)").remove();
		var index = 0;
		
		$("#videoProductType").find("option").remove();
		
		$.each( snapshot.val(), function( key, value ) {
			
			$('#videoProductType').append($("<option></option>").attr("value", key).text(value.name));
			
			firebase.database().ref("users/" + value.author_uid).once("value").then(function(sub_snapshot){
				index++
				var cls = "success";
				if(value.status == 1)
				{
					cls = "success";
				}
				else
				{
					cls = "danger";
				}
				
				$("#product_list_table").find("tbody").append("<tr class=\""+cls+"\"><td>" + index + "</td><td>" + key + "</td><td>" + value.name + "</td><td>" + getFormattedData(value.creation_date) + "</td><td>" + sub_snapshot.val().name + "</td><td>" + value.description + "</td><td><span class=\"glyphicon glyphicon-pencil edit-product-btn\" aria-hidden=\"true\"></span>&nbsp;&nbsp;&nbsp;<span class=\"glyphicon glyphicon-remove-sign block-product-btn\" aria-hidden=\"true\"></span></td></tr>");
				
			});
			
		});
	});
	
	
	$(document).on("click", ".block-product-btn", function(){
		var cls_name = $(this).parent().parent().attr("class");
		var uid = $(this).parent().parent().find("td")[1].innerHTML;
		
		if(cls_name == "success"){
			firebase.database().ref().child('/products/' + uid).update({ status: 0});
			$(this).parent().parent().attr("class", "danger");
		}
		
		if(cls_name == "danger"){
			firebase.database().ref().child('/products/' + uid).update({ status: 1});
			$(this).parent().parent().attr("class", "success");
		}
		//
	});
	
	$(document).on("click", ".edit-product-btn", function(){
		$('#modalProduct').modal('toggle');
		var code = $(this).parent().parent().find("td")[1].innerHTML;
		$("#codeProduct").val(code);
		$("#nameProduct").val($(this).parent().parent().find("td")[2].innerHTML);
		$("#descriptionProduct").val($(this).parent().parent().find("td")[5].innerHTML);
		
		$('#parentProduct').find('option').remove();
		
		$("#product_list_table").find("tr:gt(0)").each(function(tr){
			
			
			if(code != $(this).find("td")[1].innerHTML)
			{
				$('#parentProduct').append($("<option></option>").attr("value",$(this).find("td")[1].innerHTML).text($(this).find("td")[2].innerHTML));
				
			}
			
		});
	});
	
	$(document).on("click", "#updateProductBtn", function(){
		firebase.database().ref().child('/products/' + $("#codeProduct").val()).update({name: $("#nameProduct").val(), description: $("#descriptionProduct").val()})
		$('#modalProduct').modal('toggle');
	});
	
	
	firebase.database().ref("categories").on("value", function(snapshot){
		
		$("#course_list_table").find("tr:gt(0)").remove();
		$("#courseList").find('option').remove();
		
		var index = 0;
		$.each( snapshot.val(), function( key, value ) {
			
			$('#courseList').append($("<option></option>").attr("value", key).text(value.name));
			
			index++;
			var cls = "success";
			if(value.blocked == 0) {
				cls = "success";
			}
			
			if(value.blocked == 1) {
				cls = "danger";
			}
			$("#course_list_table").find("tbody").append("<tr class=\""+cls+"\"><td>"+index+"</td><td>"+key+"</td><td>"+value.name+"</td><td><span class=\"glyphicon glyphicon-pencil edit-course-btn\" aria-hidden=\"true\"></span>&nbsp;&nbsp;&nbsp;<span class=\"glyphicon glyphicon-remove-sign block-course-btn\" aria-hidden=\"true\"></span></td></tr>");
		});
	});
	
	$(document).on("click", ".block-course-btn", function(){
		var cls_name = $(this).parent().parent().attr("class");
		var uid = $(this).parent().parent().find("td")[1].innerHTML;
		
		if(cls_name == "success"){
			firebase.database().ref().child('/categories/' + uid).update({ blocked: 1});
			$(this).parent().parent().attr("class", "danger");
		}
		
		if(cls_name == "danger"){
			firebase.database().ref().child('/categories/' + uid).update({ blocked: 0});
			$(this).parent().parent().attr("class", "success");
		}
		//
	});
	
	$(document).on("click", ".edit-course-btn", function(){		
		$('#modalCourse').modal('toggle');
		var code = $(this).parent().parent().find("td")[1].innerHTML;
		$("#codeCourse").val(code);
		$("#nameCourse").val($(this).parent().parent().find("td")[2].innerHTML);		
	});
	
	$(document).on("click", "#updateCourseBtn", function(){		
		firebase.database().ref().child('/categories/' + $("#codeCourse").val()).update({name: $("#nameCourse").val()})
		$("#modalCourse").modal("toggle");
	});
	
	firebase.database().ref("users").on("value", function(snapshot){
		
		$("#user_list_table").find("tr:gt(0)").remove();
		var index = 0;
		
		
		$.each( snapshot.val(), function( key, value ) {
			var cls = "success";
			if(value.blocked == 0) {
				cls = "success";
			}
			
			if(value.blocked == 1) {
				cls = "danger";
			}
			
			firebase.database().ref("/products/" + value.product).once("value").then(function(sub_snapshot){
				if(sub_snapshot.val() != null){
					$("#user_list_table").find("tbody").append("<tr class=\""+cls+"\"><td>"+key+"</td><td>"+value.name+"</td><td>"+value.email+"</td><td>"+getFormattedData(value.creation_date)+"</td><td>"+sub_snapshot.val().name+"</td><td><span class=\"glyphicon glyphicon-remove-sign block-user-btn\" aria-hidden=\"true\"></span></td></tr>");
				}
			});
		});
		
	});
	
	$(document).on("click", ".block-user-btn", function(){
		var cls_name = $(this).parent().parent().attr("class");
		var uid = $(this).parent().parent().find("td")[0].innerHTML;
		
		if(cls_name == "success"){
			firebase.database().ref().child('/users/' + uid).update({ blocked: 1});
			$(this).parent().parent().attr("class", "danger");
		}
		
		if(cls_name == "danger"){
			firebase.database().ref().child('/users/' + uid).update({ blocked: 0});
			$(this).parent().parent().attr("class", "success");
		}		
	});
	
	
	
	
	
	
	$(document).on("click", "#videoAddBtn", function(){
		
		$("#add_video .errorMessage").css("display", "none");
		
		if($("#videoName").val().trim() == ""){
			$("#add_video label[for='videoName']").css("display", "block");			
		}
		
		if($("#videoDescription").val().trim() == ""){
			$("#add_video label[for='videoDescription']").css("display", "block");			
		}
		
		if($("#fileUploadItem").val() == ""){
			$("#add_video label[for='fileUploadItem']").css("display", "block");			
		}
		
		if($("#add_video .errorMessage:visible").length > 0){			
			return false;
		}
		
		
		
		
			
		
		var reader = new FileReader();
		var file = document.getElementById("fileUploadItem").files[0];
		
		reader.onloadend = function (evt) {
			
			
			var blob = new Blob([evt.target.result], { type: file.type });
			
			
			var path = "/videos/" + guid() + "." + file.name.split('.').pop().toLowerCase();

			var storageRef = firebase.storage().ref(path);
			
			storageRef.put(blob).then(function(snapshot) {
				
				var key = firebase.database().ref().child('videos').push().key;
				var result = firebase.database().ref().child("videos/" + key).set({
					author_uid: 	"1UYnTybjrdNxQ7TaX60PJ3pPMdr1",
					category: 		$("#courseList").val(),
					creation_date: 	new Date()/1000,
					description: 	$("#videoDescription").val(),
					format: 		file.type,
					modified_date: 	new Date()/1000,
					name: 			$("#videoName").val(),
					path: 			path,
					size: 			file.size,
					blocked: 		0,
					tariff: 		$("#videoProductType").val(),
					file_name: 		file.name
				});
				
				
			});

		}
		
		reader.readAsArrayBuffer(file);
		
		
	});
	
	firebase.database().ref("videos").once("value").then(function(snapshot){
		$("#video_list_table").find("tr:gt(0)").remove();
		
		$.each(snapshot.val(), function(key, value){
			
			var path = firebase.storage().ref(value.path).fullPath;
			console.log(path);
			
			$("#video_list_table").find("tbody").append("<tr><td>" + key + "</td><td><video controls width=\"300\" class=\"embed-responsive-item\"><source src=\"" + "https://firebasestorage.googleapis.com/v0/b/test1-2d3f3.appspot.com/o/videos%2F92d59625-9276-3275-0c85-073b6c50c46d.mp4?alt=media&token=df92f43c-2688-4bc7-bee3-ddc2d409eff5" + "\" type=\"video/mp4\"></video></td></tr>");
			
			
		});
		
		console.log(snapshot.val());
	});
	
	
	

	
	
});