$(document).ready(function(){

	var Todo = function(data) {
		this.id = data.id;
		this.description = data.description;
		this.isComplete = data.is_complete;
	}

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
				var todo = new Todo(data[i]);
				if (todo.isComplete === false) {
					$('#todo-list').append("<div class='todo' id='" + todo.id + "'>" + todo.description + "<div>");
				}
				else {
					$('#todo-done').append("<div>" + todo.description + "<div>");

				}
			}
		}

		$('.todo').change(function() {
			var todoId = $(this).attr("id");
			var todoDescription = $(this).text();
			if (this.checked) {
				console.log("checked " + todoId);
				var request = $.ajax({
					url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos/" + todoId,
					type: "PUT",
					data:  { api_token: sessionStorage.apiToken, todo: {description: todoDescription, is_complete: true }}
				});
      }
      else {
      	console.log("unchecked " + todoId);
      	var request = $.ajax({
					url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos/" + todoId,
					type: "PUT",
					data:  { api_token: sessionStorage.apiToken, todo: {description: todoDescription, is_complete: false }}
				});
      }

    });


	};

	// $(function() {
 //    $( "#todo-list" ).droppable({
 //      drop: function( event, ui ) {
 //      	console.log(this);
 //      	console.log("i've been moved to todo list!");
 //        $( "#todo-list" ).append( this );
 //        $( "#todo-done").remove( this );
 //      }
 //    });
 //  });

	var sortTodos = $(function() {
    $( "#todo-list" ).sortable();
    $( "#todo-list" ).disableSelection();
    $( "#todo-done" ).sortable();
    $( "#todo-done" ).disableSelection();
  });

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
