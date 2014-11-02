$(document).ready(function(){

	$("#login").click(function(event) {
		event.preventDefault();

		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;
		var request = $.ajax({
			url: "http://recruiting-api.nextcapital.com/users/sign_in",
			type: "POST",
			dataType: 'json',
			data:  { email: email, password: password },
			success: function(data) {
				setSessionInfo(data);
				$('#sign-in-form').find("input[type=text], input[type=password]").val("");
				hideSignInForm();
			}
		})
		request.success(showTodos());
		request.success(getTodos());

	})

	var showTodos = function() {
		$("#todo-space").show();
	}

	var getTodos = function(){
		var request = $.ajax({
			url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos.json?api_token=" + sessionStorage.apiToken,
			type: "GET"
		});
		request.success(listTodos);
	};
	

	var listTodos = function(data) {
		if (data.length === 0) {
			$("#todo-list").prepend("<p>looks like you need to add some todos!</p>")
		}
		else {
			for (i = 0; i < data.length; i++) {
				console.log(data);
				$('#todo-list').append("<input class='todo-checkbox' type='checkbox' name='" + data[i].id + "' value='true'>" + data[i].description + "<br>");
			}
		}

		$('.todo-checkbox').change(function() {
			console.log("I'm here!");
			var todoId = $(this).attr("name");
			if (this.checked) {
				console.log("checked " + todoId);
				var request = $.ajax({
					url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos/" + todoId,
					type: "PUT",
					data:  { api_token: sessionStorage.apiToken, is_complete: true }
				});
      }
      else {
      	console.log("unchecked " + todoId)
      }

    });


	};

	$('#new-todo-button').click(function(event){
		event.preventDefault();
		var description = document.getElementById("new-todo").value;
		$('#new-todo-form').find("input[type=text]").val("");
		var request = $.ajax({
			url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos",
			type: "POST",
			data:  { api_token: sessionStorage.apiToken, todo: { description:  description } }
		});

		request.success(appendTodo);

	})
	
	var setSessionInfo = function(data) {
		sessionStorage.setItem("apiToken", data.api_token);
		sessionStorage.setItem("userId", data.id);
	}

	var hideSignInForm = function() {
		if (sessionStorage.apiToken != null) {
			$('#sign-in-form').hide();
			$("#logout").show();
		}
	}

	var appendTodo = function(todo) {
		$('#todo-list').append("<input type='checkbox' name='" + todo.id + "value='true'>" + todo.description + "<br>")
	}

	$("#logout").click(function(event){
		event.preventDefault();
		
		sessionStorage.clear();
		$('#todo-list').empty();
		$('#todo-space').hide();
		$('#sign-in-form').show();

	});

			

	
});




// (function(){
// 	var app = angular.module('todo', []);

// 	app.controller('TodoController', function(){
// 		this.list = getTodos();

// 	});



// })();
