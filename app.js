var context;
var x_size = 15;
var y_size = 15;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
//? var signin = false;
var balls5_color;
var balls15_color;
var balls25_color;
var last_move;
//
var num_invalidation; //lives
/*var ball5;
var ball15;
var ball25;*/

//active user
var login_username = null;
//
var in_game = false;


//Dictionary of configurations
var config = {
	//keys
	'up' : 38,
	'down' : 40,
	'right' : 39,
	'left' : 37,
	'balls' : 50,
	'5_balls' : '#e66465',
	'15_balls' : '#f6b73c',
	'25_balls' : '#66ff66',
	'game_time' : 60,
	'ghost_num' : 1
};

var ids = {
	empty_id : 0,
	packman_id : 1,
	obstacles_id : 2,
	//balls
	ball5_id : 3,
	ball15_id : 4,
	ball25_id : 5,
	//ghost
	ghost1_id : 6,
	ghost2_id : 7,
	ghost3_id : 8,
	ghost4_id : 9,
	//speicl
	speicl_id : 10
}

//ghost positons
var ghost_pos = [];

//global dictionary
var dict = {
	"k" : "k"
}

$(document).ready(function(){
	// Get the element with id="welconBtn" and click on it
	document.getElementById("welconBtn").click();

	// signup validation
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
				validateEmail: true
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
				validateEmail: "Please enter a valid email address."
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

	$("#configurationForm").validate({
		rules: {
			upbutton: {
				required: true
			},
			downbutton: {
				required: true
			},
			rightbutton: {
				required: true
			},
			leftbutton: {
				required: true
			},
			numballs: {
				required: true,
				min: 50,
				max : 90
			},
			gametime: {
				required: true,
				min: 60
			},
		},
		messages: {
			upbutton: {
				required: "This field is required."
			},
			downbutton: {
				required: "This field is required."
			},
			rightbutton: {
				required: "This field is required."
			},
			leftbutton: {
				required: "This field is required."
			},
			numballs: {
				required: "This field is required..",
				min: "Please enter a value greater than or equal to 50.",
				max: "Please enter a value less than or equal to 90."
			},
			gametime: {
				required: "This field is required.",
				min: "Please enter a value greater than or equal to 60.",
			},
		},
		submitHandler: function(form, event){
			event.preventDefault();
			//update configuration
			//keys
			config['up'] = parseInt(document.getElementById('upbutton').value);
			config['down'] = parseInt(document.getElementById('downbutton').value);
			config['right'] = parseInt(document.getElementById('rightbutton').value);
			config['left'] = parseInt(document.getElementById('leftbutton').value);
			//balls
			config['balls'] = parseInt(document.getElementById('balls').value);
			//colors
			config['5_balls'] = document.getElementById('5_balls').value;
			config['15_balls'] = document.getElementById('15_balls').value;
			config['25_balls'] = document.getElementById('25_balls').value;
			//game time
			config['game_time'] = parseInt(document.getElementById('gametime').value);
			//ghosts
			config['ghost_num'] = parseInt(document.getElementById('points').value)
			//
			let fm = document.getElementById("configurationForm");
			fm.reset();
			startGame();	
		}
	});

	//create the modalDialog
	var aboutButton = document.getElementById('AboutBtn');
	var modalDialog = document.getElementById('ModalDialog');
	var xButton = document.getElementById("xBtn");
	var aboutDiv = document.getElementById("About");

	aboutButton.addEventListener('click', function onOpen() {
		openPage('About');
		if (typeof modalDialog.showModal == "function") {
			modalDialog.showModal();
			modalDialog.style.visibility = 'visible';
		} else {
		alert("The <dialog> API is not supported by this browser");
		}
	});

	// closing the modalDialog
	aboutDiv.addEventListener('close', function onClose(event) {
		if(event.keyCode == 27){
			modalDialog.style.visibility = 'hidden';
		}
		
	});
	xButton.addEventListener('click', function onClose(event) {
		showDialog = false;
		modalDialog.style.visibility = 'hidden';
	});
	
	window.top.onclick = function(event) {
		if(event.target == aboutDiv && modalDialog.style.visibility.value == 'visible') {
			modalDialog.style.visibility = 'close';
		}
	}
});

//validation of password
$(function(){
	$.validator.addMethod('validatePassword', function(value, element){
		return this.optional(element) || /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(value);
	})
});

//validation email
$(function(){
	$.validator.addMethod('validateEmail', function(value, element){
		return this.optional(element) || /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
	})
});


//login function
function Login(event){
	event.preventDefault();
	let name = document.getElementById("Username").value;
	let password = document.getElementById("Password").value;
	if(dict[name] == password){
		openPage("Configuration");
		document.getElementById("loginForm").reset();
		//signin = true;
		login_username = name; 
	}
	else if(name == "" || password == ""){
		alert("Type your details if you have an account");
	} 
	else 
		alert("Your username or password isn't correct");	
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

function Random(){
	//balls
	document.getElementById('balls').value = Math.floor(Math.random() * 40) + 50;
	//colors
	document.getElementById('5_balls').value = getRandomColor();
	document.getElementById('15_balls').value = getRandomColor();
	document.getElementById('25_balls').value = getRandomColor();
	//game time
	document.getElementById('gametime').value = parseInt(Math.random(1)*60) + 60;
	//
	document.getElementById('points').value = Math.floor(Math.random() * 4) + 1;
}

function configurationShow(){
	//keys
	$("#valUp").text(config['up']);
	$("#valDown").text(config['down']);
	$("#valRight").text(config['right']);
	$("#valLeft").text(config['left']);
	//nubmers of balls
	$("#valBalls").text(config['balls']);
	//colors of balls
	$("#val5_balls").text(config['5_balls']);
	$("#val15_balls").text(config['15_balls']);
	$("#val25_balls").text(config['25_balls']);
	//game time
	$("#valTime").text(config['game_time']);
	//number of ghosts
	$("#valGhost").text(config['ghost_num']);
}

function startGame(){
	in_game = true;
	openPage('Game')
	configurationShow();
	$("#loginName").text(login_username);
	context = canvas.getContext("2d");
	x = config['right'];
	//
	initialized_boardGame();
	put_obstacles();
	put_ghosts();
	put_foods();
	put_pacman();
	initialized_keys();

}

function initialized_boardGame(){
	score = 0;
	pac_color = "yellow";
	start_time = new Date();
	num_invalidation = 5; // reset the lives
	board = new Array();
	for (let i = 0; i < x_size; i++){
		board[i] = [] //new array
		for (let j=0 ; j < y_size; j++){
			board[i].push([ids.empty_id]); //list of ids 
		}
	}
}

function put_obstacles(){
	// need to create the figure i want to look like
	for(var idx = 0; idx < x_size; idx++){
		board[0][idx][0] = ids.obstacles_id;
		board[x_size-1][idx][0] = ids.obstacles_id;
		board[idx][0][0] = ids.obstacles_id;
		board[idx][y_size-1][0] = ids.obstacles_id;
	}
	//top left
	board[2][2][0] = ids.obstacles_id;
	board[3][2][0] = ids.obstacles_id;
	board[2][3][0] = ids.obstacles_id;
	//top right
	board[2][12][0] = ids.obstacles_id;
	board[2][11][0] = ids.obstacles_id;
	board[3][12][0] = ids.obstacles_id;
	//down left
	board[11][2][0] = ids.obstacles_id;
	board[12][2][0] = ids.obstacles_id;
	board[12][3][0] = ids.obstacles_id;
	//down right
	board[11][12][0] = ids.obstacles_id;
	board[12][12][0] = ids.obstacles_id;
	board[12][11][0] = ids.obstacles_id;

	//lines
	//center top up -
	board[6][2][0] = ids.obstacles_id;
	board[7][2][0] = ids.obstacles_id;
	board[8][2][0] = ids.obstacles_id;
	
	//center |
	board[7][5][0] = ids.obstacles_id;
	board[7][6][0] = ids.obstacles_id;
	board[7][7][0] = ids.obstacles_id;
	board[7][8][0] = ids.obstacles_id;
	board[7][9][0] = ids.obstacles_id;

	//center top down -
	board[6][12][0] = ids.obstacles_id;
	board[7][12][0] = ids.obstacles_id;
	board[8][12][0] = ids.obstacles_id;
	
	//left side
	board[3][5][0] = ids.obstacles_id;
	board[3][9][0] = ids.obstacles_id;
	board[4][5][0] = ids.obstacles_id;
	board[4][6][0] = ids.obstacles_id;
	board[4][7][0] = ids.obstacles_id;
	board[4][8][0] = ids.obstacles_id;
	board[4][9][0] = ids.obstacles_id;

	//right side
	board[11][5][0] = ids.obstacles_id;
	board[11][9][0] = ids.obstacles_id;
	board[10][5][0] = ids.obstacles_id;
	board[10][6][0] = ids.obstacles_id;
	board[10][7][0] = ids.obstacles_id;
	board[10][8][0] = ids.obstacles_id;
	board[10][9][0] = ids.obstacles_id;

}

function put_ghosts(){
	board[1][1][0] = ids.ghost1_id;
	ghost_pos[0] = new Object();
	ghost_pos[0].row = 1;
	ghost_pos[0].col = 1;
	if(config['ghost_num'] >= 2){
		board[1][y_size-2][0] = ids.ghost2_id;
		ghost_pos[1] = new Object();
		ghost_pos[1].row = 1;
		ghost_pos[1].col = y_size-2;
	}
	if(config['ghost_num'] >= 3){
		board[x_size-2][1][0] = ids.ghost3_id;
		ghost_pos[2] = new Object();
		ghost_pos[2].row = x_size-2;
		ghost_pos[2].col = 1;
	}
	if(config['ghost_num'] >= 4){
		board[x_size-2][y_size-2][0] = ids.ghost4_id;
		ghost_pos[3] = new Object();
		ghost_pos[3].row = x_size-2;
		ghost_pos[3].col = y_size-2;
	}
}

function put_foods(){
	let food_remain = [config['balls']*0.6,config['balls']*0.3,config['balls']*0.1] //number of balls
	while (food_remain[0] > 0) {
		let emptyCell = findRandomEmptyCell();
		board[emptyCell[0]][emptyCell[1]][0] = 3;
		food_remain[0]--;
	}
	while (food_remain[1] > 0) {
		let emptyCell = findRandomEmptyCell();
		board[emptyCell[0]][emptyCell[1]][0] = 4;
		food_remain[1]--;
	}
	while (food_remain[2] > 0) {
		let emptyCell = findRandomEmptyCell();
		board[emptyCell[0]][emptyCell[1]][0] = 5;
		food_remain[2]--;
	}
}

function put_pacman(){
	let emptyCell = findRandomEmptyCell();
	board[emptyCell[0]][emptyCell[1]][0] = 1;
	//place the i,j of the pacman
	shape.i = emptyCell[0]; 
	shape.j = emptyCell[1];
	initialized_keys();
}

function initialized_keys() { 
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	// addEventListener(
	// 	"keyup",
	// 	function(e) {
	// 		keysDown[e.keyCode] = false;
	// 	},
	// 	false
	// );
	interval = setInterval(UpdatePosition, 200); //
}

function findRandomEmptyCell() {
	var i = Math.floor(Math.random() * (x_size - 1));
	var j = Math.floor(Math.random() * (y_size - 1));
	while (board[i][j][0] != 0) { //empty always in first place
		i = Math.floor(Math.random() * (x_size - 1));
		j = Math.floor(Math.random() * (y_size - 1));
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[config['up']]) { //up
		return 1;
	}
	if (keysDown[config['down']]) { //down
		return 2;
	}
	if (keysDown[config['left']]) { //left
		return 3;
	}
	if (keysDown[config['right']]) { //right
		return 4;
	}
}

function draw_pacman(center_x, center_y){
	var move_dire = GetKeyPressed();
	if(move_dire === undefined || move_dire == 4){
		context.beginPath();
		context.arc(center_x - 20, center_y - 20, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center_x - 20, center_y - 20);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center_x - 15, center_y - 30, 3, 0, 2 * Math.PI); // circle - packman's eye
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if(move_dire == 3){
		context.beginPath();
		context.arc(center_x - 20, center_y - 20, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center_x - 20, center_y - 20);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center_x - 15, center_y - 30, 3, 0, 2 * Math.PI); // circle - packman's eye
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if(move_dire == 1){
		context.beginPath();
		context.arc(center_x - 20, center_y - 20, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center_x - 20, center_y - 20);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center_x - 15, center_y - 30, 3, 0, 2 * Math.PI); // circle - packman's eye
		context.fillStyle = "black"; //color
		context.fill();
	}
	else if(move_dire == 2){
		context.beginPath();
		context.arc(center_x - 20, center_y - 20, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
		context.lineTo(center_x - 20, center_y - 20);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center_x - 15, center_y - 30, 3, 0, 2 * Math.PI); // circle - packman's eye
		context.fillStyle = "black"; //color
		context.fill();
	}
}


function Draw() {
	canvas.width = canvas.width; //clean board
	$("#lblScore").text(score);
	$("#lblTime").text(time_elapsed);
	$("#lblInvalidation").text(num_invalidation);
	for (var i = 0; i < x_size; i++) {
		for (var j = 0; j < y_size; j++) {
			var center = new Object();
			center.x = i * 40 + 40;
			center.y = j * 40 + 40;
			if (board[i][j] == 1) {   //pacman
				/*context.beginPath();
				context.arc(center.x - 20, center.y - 20, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x - 20, center.y - 20);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x - 15, center.y - 30, 3, 0, 2 * Math.PI); // circle - packman's eye
				context.fillStyle = "black"; //color
				context.fill();*/
				draw_pacman(center.x, center.y);
			} else if (board[i][j] == 3) { // 5 balls
				context.beginPath();
				context.arc(center.x - 20, center.y - 20, 5, 0, 2 * Math.PI); // circle - 5 ball's color
				context.fillStyle = config['5_balls']; //color
				context.fill();
			} else if (board[i][j] == 4) { //15 balls
				context.beginPath();
				context.arc(center.x - 20, center.y - 20, 5, 0, 2 * Math.PI); // circle - 15 ball's color
				context.fillStyle = config['15_balls']; //color
				context.fill();
			} else if (board[i][j] == 5) { // 25 balls
				context.beginPath();
				context.arc(center.x - 20, center.y - 20, 5, 0, 2 * Math.PI); // circle - 25 ball's color
				context.fillStyle = config['25_balls']; //color
				context.fill();
			} else if (board[i][j] == 2) { // obstacles
				context.beginPath();
				context.rect(center.x - 40, center.y - 40, 40, 40);
				context.fillStyle = "grey"; //color
				context.fill();
			} else if (board[i][j] == 6) { 
				context.beginPath();
				context.rect(center.x - 40, center.y - 40, 40, 40);
				context.fillStyle = "red"; //color
				context.fill();
			} else if (board[i][j] == 7) {
				context.beginPath();
				context.rect(center.x - 40, center.y - 40, 40, 40);
				context.fillStyle = "orange"; //color
				context.fill();
			} else if (board[i][j] == 8) {
				context.beginPath();
				context.rect(center.x - 40, center.y - 40, 40, 40);
				context.fillStyle = "green"; //color
				context.fill();
			} else if (board[i][j] == 9) {
				context.beginPath();
				context.rect(center.x - 40, center.y - 40, 40, 40);
				context.fillStyle = "purple"; //color
				context.fill();
			} else if (board[i][j] == 10) {
				context.beginPath();
				context.rect(center.x - 40, center.y - 40, 40, 40);
				context.fillStyle = "pink"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	if(in_game){
		board[shape.i][shape.j][0] = ids.empty_id; // empty
		let move_dire = GetKeyPressed();  //the current press
		// if(move_dire != undefined){
		// 	x = move_dire;
		// }
		if (move_dire == 1) {
			if (shape.j > 0 && board[shape.i][shape.j - 1] != 2) {
				shape.j--;
			}
			move_dire = undefined;
			keysDown[config['up']] = false;
		}
		else if (move_dire == 2) {
			if (shape.j < y_size && board[shape.i][shape.j + 1] != 2) {
				shape.j++;
			}
			move_dire = undefined;
			keysDown[config['down']] = false;
		}
		else if (move_dire == 3) {
			if (shape.i > 0 && board[shape.i - 1][shape.j] != 2) {
				shape.i--;
			}
			move_dire = undefined;
			keysDown[config['left']] = false;
		}
		else if (move_dire == 4) {
			if (shape.i < x_size && board[shape.i + 1][shape.j] != 2) {
				shape.i++;
			}
			move_dire = undefined;
			keysDown[config['right']] = false;
		} else {
			Draw();
		}
		if (board[shape.i][shape.j] == ids.ball5_id) { //5 balls
			score+=5;
		}
		else if (board[shape.i][shape.j] == ids.ball15_id) { //15 balls
			score+=15;
		}
		else if (board[shape.i][shape.j] == ids.ball25_id) { //25 balls
			score+=25;
		}  
		board[shape.i][shape.j] = [ids.packman_id]; // packman
		var currentTime = new Date();
		time_elapsed = (currentTime - start_time) / 1000;
		/*if (score >= 100 && time_elapsed <= 10) {
			pac_color = "green";
		}*/
		//game finish but all balls not eaten
		if(num_invalidation == 0){            //end game when there is no lives
			window.clearInterval(interval);
			window.alert("Loser!");
		}
		else if(time_elapsed >= config['game_time']){
			if(score < 100){
				window.clearInterval(interval);
				window.alert("You are better then " + score + " points!");
			}
			else{
				window.clearInterval(interval);
				window.alert("Winner!!!");
			}
		}
		else if(check_collision()){
			alert("collision");
			ghost_collision();
		}
		else {
			Draw();
		}
	}
}

function check_collision(){
	for(let i = 0; i< config['ghost_num']; i++){
		if(ghost_pos[i].row == shape.i && ghost_pos[i].col == shape.j){
			return true;
		}
	}
	return false;
}

function ghost_collision(){ ////////////
	score-=10;
	num_invalidation-=1;
	setTimeout(() => { Draw() }, 60);
	board[shape.i][shape.j] = [0];
	put_ghosts();
	put_pacman();
}

function pause_game(){
	canvas.width = canvas.width;
	in_game = false;
}

function openPage(pageName) {
	if(in_game && pageName != "Game")
		pause_game();
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

