$(document).ready(function(){

	var User = function(userInfo) {
		this.email = userInfo.email;
		this.apiToken = userInfo.api_token;
		this.id = userInfo.id;
		this.todos = userInfo.todos;
	}

	var getTodos = function(userId, apiToken){
		var request = $.ajax({
			url: "http://recruiting-api.nextcapital.com/users/" + userId + "/todos.json?api_token=" + apiToken,
			type: "GET",
			success: function(todos) {
			}
			
		});
	};
	
	$("#login").click(function(event) {
		event.preventDefault();

		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;
		var request = $.ajax({
			url: "http://recruiting-api.nextcapital.com/users/sign_in",
			type: "POST",
			data:  { email: email, password: password },
			success: function(data) {
				var user = createUser(data);
				if (user.apiToken != null) {
					$('#sign-in-form').hide();
				}




				if (user.todos === []) {
					$('#todo-list').append("<p>looks like you need to add some todos!</p>")
				}
				else {
					$('#todo-list').append(user.todos);
				}
			}
		})

		var createUser = function(userInfo) {
			return new User(userInfo);
		}


	})
	
});




(function(){
	var app = angular.module('todo', []);

	app.controller('TodoController', function(){
		this.list = getTodos();

	});



})();
