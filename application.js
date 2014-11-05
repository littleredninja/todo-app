$(document).ready(function(){

	var Todo = function(data) {
		this.id = data.id;
		this.description = data.description;
		this.isComplete = data.is_complete;
	}

	$("#login-button").click(function(event) {
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
				clearInputForms();
				hideLogIn();
				showTodos();
				getTodos();
			},
			error: function(data) {
				alert("oops! something went wrong, please try again");
				clearInputForms();
			}
		})
	})

	var clearInputForms = function() {
		$("input[type=text], input[type=password]").val("");
	}

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
			$("#todo-list").prepend("<p>Looks like you need to add some todos!</p>")
		}
		else {
			for (i = 0; i < data.length; i++) {
				var todo = new Todo(data[i]);
				if (todo.isComplete === false) {
					appendTodo(todo);
				}
				else {
					$('#todo-done').append("<li class='todo' draggable='true' id='" + todo.id + "'>" + todo.description + "</li>");
				}
			}
		}
	};

	$(function() {
    $( "#todo-list, #todo-done" ).sortable({
      connectWith: ".list"
    }).disableSelection();
  });

  $( "#todo-done" ).droppable({
    drop: function( event, ui ) {
      var todoId = $(ui.draggable).attr("id");
      var todoDescription = $(ui.draggable).text();
			var request = $.ajax({
				url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos/" + todoId,
				type: "PUT",
				data:  { api_token: sessionStorage.apiToken, todo: {description: todoDescription, is_complete: true }},
    	});
    }
  });

  $( "#todo-list" ).droppable({
    drop: function( event, ui ) {
      var todoId = $(ui.draggable).attr("id");
      var todoDescription = $(ui.draggable).text();
			var request = $.ajax({
				url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos/" + todoId,
				type: "PUT",
				data:  { api_token: sessionStorage.apiToken, todo: {description: todoDescription, is_complete: false }},
    	});
    }
  });

	$('#new-todo-button').click(function(event){
		event.preventDefault();
		var description = document.getElementById("new-todo").value;
		var request = $.ajax({
			url: "http://recruiting-api.nextcapital.com/users/" + sessionStorage.userId + "/todos",
			type: "POST",
			data:  { api_token: sessionStorage.apiToken, todo: { description: description } }
		});
		clearInputForms();
		request.success(appendTodo);
	})
	
	var setSessionInfo = function(data) {
		sessionStorage.setItem("apiToken", data.api_token);
		sessionStorage.setItem("userId", data.id);
	}

	var hideLogIn = function() {
		if (sessionStorage.apiToken != null) {
			$('#login-space').hide();
			$("#logout").show();
		}
	}

	var appendTodo = function(todo) {
		$('#todo-list').append("<li class='todo' draggable='true' id='" + todo.id + "'>" + todo.description + "</li>");
	}

	$("#logout").click(function(event){
		event.preventDefault();
		
		sessionStorage.clear();
		$('#todo-list, #todo-done').empty();
		$('#todo-space').hide();
		$('#login-space').show();
	});

});


