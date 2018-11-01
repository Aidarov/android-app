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
		
		//console.log(snapshot.val());
		
		$.each( snapshot.val(), function( key, value ) {
			
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
		var index = 0;
		$.each( snapshot.val(), function( key, value ) {
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
	
});