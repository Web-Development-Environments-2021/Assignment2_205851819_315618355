var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var signin = false;

//global dictionary
var dict = {
	"k" : "k"
}

$(document).ready(function(){
	// Get the element with id="defaultOpen" and click on it
	document.getElementById("defaultOpen").click();

	$("#signupForm").validate({
		rules: {
			username: {
				required: true
			},
			password: {
				required: true,
				minlength: 6,	
				validatePassword: true
			},
			fullname: {
				required: true,
				lettersonly: true,
				minlength: 2
			},
			email: {
				required: true,
				email: true
			}
		},
		messages: {
			username: {
				required: "Required input."
			},
			password: {
				required: "Required input.",
				minlength: "Password must be at least 6 characters.",
				validatePassword: "Password must contains letters and numbers."
			},
			fullname: {
				required: "Required input.",
				lettersonly: "Fullname include only letters.",
				minlength: "This filed must be at least 2 characters."
			},
			email: {
				required: "Required input.",
				email: "Please enter a valid email address."
			}
		},
		submitHandler: function(form, event){
			event.preventDefault();
			let name = document.getElementById("username").value;
			let password = document.getElementById("password").value;
			dict[name] = password;
			let fm = document.getElementById("signupForm");
			fm.reset();
			openPage("Welcome");	
		}
	});

	//create the modalDialog
	var aboutButton = document.getElementById('AboutBtn');
	var modalDialog = document.getElementById('ModalDialog');
	var xButton = document.getElementById("xBtn");

	aboutButton.addEventListener('click', function onOpen() {
		openPage('About');
		if (typeof modalDialog.showModal == "function") {
			modalDialog.showModal();
			showDialog = true;
		} else {
		alert("The <dialog> API is not supported by this browser");
		}
	});

	// closing the modalDialog
	modalDialog.addEventListener('close', function onClose(event) {
		if(event.keyCode == 27){
			modalDialog.close()
		}
		
	});
	xButton.addEventListener('click', function onClose(event) {
		showDialog = false;
		modalDialog.close()
	});
	modalDialog.addEventListener('click', function (event) {
		document.alert(event.target.closest('.dialog'))
		if(!event.target.closest('.dialog'))
			modalDialog.close()
	})
});

//validation of password
$(function(){
	$.validator.addMethod('validatePassword', function(value, element){
		return this.optional(element) || /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value);
	})
});

//login function
function Login(event){
	event.preventDefault();
	let name = document.getElementById("Username").value;
	let password = document.getElementById("Password").value;
	if(dict[name] == password){
		openPage("Game");
		document.getElementById("loginForm").reset();
		signin = true;
		context = canvas.getContext("2d");
		Start();
	}
	else 
		alert("Your username or password isn't correct");	
}


/*
$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
});*/

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}

function openPage(pageName) {
	// Hide all elements with class="tabcontent" by default */
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
	  tabcontent[i].style.display = "none";
	}
  
	// Remove the background color of all tablinks/buttons
	tablinks = document.getElementsByClassName("tablink");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].style.backgroundColor = "";
	}
  
	// Show the specific tab content
	document.getElementById(pageName).style.display = "block";
  
	// Add the specific color to the button used to open the tab content
	// elmnt.style.backgroundColor = color;
  }
  

