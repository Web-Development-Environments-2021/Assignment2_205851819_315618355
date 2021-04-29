//board
let board;
let context;
let x_size = 15;
let y_size = 15;
//pacman
let shape = new Object();
//configuration
let num_invalidation; //lives
let score;
let pac_color;
let start_time;
let time_elapsed;
let balls5_color;
let balls15_color;
let balls25_color;
//intervals
let interval;
let intervalGhost; 
//objects
let strawberry = new Object();
let clock = new Object();
//for us
let last_move;
let move_dire;
//active user
let login_username = null;
//check if we are in the game page
let in_game = false;
//clock needed
let countClock;
let addClock;

let dictionaryKey = { 'up': "ArrowUp", 'down' : 'ArrowDown', 'left' : 'ArrowLeft', 'right' : 'ArrowRight'};

//Dictionary of configurations
let config = {
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

let ids = {
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
	clock_id : 10,
	strawberry_id : 11
}

//ghost positons
let ghost_pos = [];

//file name of pictures

//pacman
let leftImg = new Image();
leftImg.src = 'left.png';
let rightImg = new Image();
rightImg.src = 'right.png';
let upImg = new Image();
upImg.src = 'up.png';
let downImg = new Image();
downImg.src = 'down.png';
//ghost
let ghost1Img = new Image();
ghost1Img.src = 'ghost1.png';
let ghost2Img = new Image();
ghost2Img.src = 'ghost2.png';
let ghost3Img = new Image();
ghost3Img.src = 'ghost3.png';
let ghost4Img = new Image();
ghost4Img.src = 'ghost4.png';
//speicl
let clockImg = new Image();
clockImg.src = 'clock.png';
//food
let foodImg = new Image();
foodImg.src = 'strawberry.png';

//global dictionary
let dict = {
	"k" : "k"
}

$(document).ready(function(){
	// Get the element with id="welconBtn" and click on it
	document.getElementById("welconBtn").click();

	window.addEventListener("keydown", function(event){
		if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) >-1)
			event.preventDefault();
	}, false);


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
	let aboutButton = document.getElementById('AboutBtn');
	let modalDialog = document.getElementById('ModalDialog');
	let xButton = document.getElementById("xBtn");
	let aboutDiv = document.getElementById("About");

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
	window.addEventListener('mouseup', function(event){
		if(event.target != modalDialog)   //not in modalDialog scope
			null;
		else
			modalDialog.close();
	});

	xButton.addEventListener('click', function onClose(event) {
		showDialog = false;
		modalDialog.close();
	});

	//ESC
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
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

function Random(){
	config['up'] = 38;
	config['down'] = 40;
	config['right'] = 39;
	config['left'] = 37;
	document.getElementById('upbutton').value = "ArrowUp";
	document.getElementById('downbutton').value = "ArrowDown";
	document.getElementById('leftbutton').value = "ArrowLeft";
	document.getElementById('rightbutton').value = "ArrowRight";
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
	$("#valUp").text(dictionaryKey['up']);
	$("#valDown").text(dictionaryKey['down']);
	$("#valRight").text(dictionaryKey['right']);
	$("#valLeft").text(dictionaryKey['left']);
	//nubmers of balls
	$("#valBalls").text(config['balls']);
	//colors of balls
	//ball 5 
	let ball5 = document.getElementById('val5_balls');
	ball5.style.color = config['5_balls'];
	ball5.style.backgroundColor = config['5_balls'];
	//ball 15
	let ball15 = document.getElementById('val15_balls');
	ball15.style.color = config['15_balls'];
	ball15.style.backgroundColor = config['15_balls'];
	//ball 25
	let ball25 = document.getElementById('val25_balls');
	ball25.style.color = config['25_balls'];
	ball25.style.backgroundColor = config['25_balls'];
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
	put_strawberry();
	put_pacman();
	initialized_keys();
	music_play.play();

}

function initialized_boardGame(){
	score = 0;
	pac_color = "yellow";
	start_time = new Date();
	countClock = start_time;
	addClock = false;
	//sound
	music_play = document.getElementById( "gameSound" );
	music_play.loop = true;
	num_invalidation = 5; // reset the lives
	board = [];
	for (let i = 0; i < x_size; i++){
		board[i] = [] //new array
		for (let j=0 ; j < y_size; j++){
			board[i].push([ids.empty_id]); //list of ids 
		}
	}
}

function put_obstacles(){
	// need to create the figure i want to look like
	for(let idx = 0; idx < x_size; idx++){
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
	//board[7][7][0] = ids.obstacles_id;
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
	ghost_pos[0].last_row = 1;
	ghost_pos[0].last_col = 1;
	if(config['ghost_num'] >= 2){
		board[1][y_size-2][0] = ids.ghost2_id;
		ghost_pos[1] = new Object();
		ghost_pos[1].row = 1;
		ghost_pos[1].col = y_size-2;
		ghost_pos[1].last_row = 1;
		ghost_pos[1].last_col = y_size-2;
	}
	if(config['ghost_num'] >= 3){
		board[x_size-2][1][0] = ids.ghost3_id;
		ghost_pos[2] = new Object();
		ghost_pos[2].row = x_size-2;
		ghost_pos[2].col = 1;
		ghost_pos[2].last_row = x_size-2;
		ghost_pos[2].last_col = 1;
	}
	if(config['ghost_num'] >= 4){
		board[x_size-2][y_size-2][0] = ids.ghost4_id;
		ghost_pos[3] = new Object();
		ghost_pos[3].row = x_size-2;
		ghost_pos[3].col = y_size-2;
		ghost_pos[3].last_row = x_size-2;
		ghost_pos[3].last_col = y_size-2;
	}
}

function put_foods(){
	let food_remain = [config['balls']*0.6,config['balls']*0.3,config['balls']*0.1] //number of balls
	while (food_remain[0] > 0) {
		let emptyCell = findRandomEmptyCell();
		board[emptyCell[0]][emptyCell[1]][0] = ids.ball5_id;
		food_remain[0]--;
	}
	while (food_remain[1] > 0) {
		let emptyCell = findRandomEmptyCell();
		board[emptyCell[0]][emptyCell[1]][0] = ids.ball15_id;
		food_remain[1]--;
	}
	while (food_remain[2] > 0) {
		let emptyCell = findRandomEmptyCell();
		board[emptyCell[0]][emptyCell[1]][0] = ids.ball25_id;
		food_remain[2]--;
	}
}

function put_strawberry(){
	board[7][7][0] = ids.strawberry_id;
	strawberry.row = 7;
	strawberry.col = 7;
}

function put_pacman(){
	let emptyCell = findRandomEmptyCell();
	board[emptyCell[0]][emptyCell[1]][0] = ids.packman_id;
	//place the i,j of the pacman
	shape.i = emptyCell[0]; 
	shape.j = emptyCell[1];
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
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 200); // maybe to enlarge the time
	intervalGhost = setInterval(intervalUpdateGhosts,600);
}

function findRandomEmptyCell() {
	let i = Math.floor(Math.random() * (x_size - 1));
	let j = Math.floor(Math.random() * (y_size - 1));
	while (board[i][j][0] != 0) { //empty always in first place
		i = Math.floor(Math.random() * (x_size - 1));
		j = Math.floor(Math.random() * (y_size - 1));
	}
	return [i, j];
}

function confikey(event, inp){
	event.preventDefault();
	inp.value = event.key;
	if(inp.id.localeCompare('upbutton') == 0){
		dictionaryKey['up'] = inp.value;
		config['up'] = event.keyCode;
	}
	else if(inp.id.localeCompare('downbutton') == 0){
		dictionaryKey['down'] = inp.value;
		config['down'] = event.keyCode;
	}
	else if(inp.id.localeCompare('leftbutton') == 0){
		dictionaryKey['left'] = inp.value;
		config['left'] = event.keyCode;
	}
	else if(inp.id.localeCompare('rightbutton') == 0){
		dictionaryKey['right'] = inp.value;
		config['right'] = event.keyCode;
	}
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
	console.log("DRAW!!!")
	console.log(move_dire);
	if(move_dire === undefined && shape.key != undefined){
		move_dire = shape.key;
	}
	else if(shape.key === undefined)  move_dire = 4;
	
	if(move_dire == 4)
		context.drawImage(rightImg, center_x-40, center_y-40, 40, 40);
	else if(move_dire == 3)
		context.drawImage(leftImg, center_x-40, center_y-40, 40, 40);
	else if(move_dire == 1)
		context.drawImage(upImg, center_x-40, center_y-40, 40, 40);
	else if(move_dire == 2)
		context.drawImage(downImg, center_x-40, center_y-40, 40, 40);
}


function Draw() {
	canvas.width = canvas.width; //clean board
	$("#lblScore").text(score);
	$("#lblTime").text(time_elapsed);
	$("#lblInvalidation").text(num_invalidation);
	for (let i = 0; i < x_size; i++) {
		for (let j = 0; j < y_size; j++) {
			let len = board[i][j].length - 1;
			let center = new Object();
			center.x = i * 40 + 40;
			center.y = j * 40 + 40;
			if (board[i][j][len] == 1) {   //pacman
				draw_pacman(center.x, center.y);
			} else if (board[i][j][len] == 3) { // 5 balls
				context.beginPath();
				context.arc(center.x - 20, center.y - 20, 5, 0, 2 * Math.PI); // circle - 5 ball's color
				context.fillStyle = config['5_balls']; //color
				context.fill();
			} else if (board[i][j][len] == 4) { //15 balls
				context.beginPath();
				context.arc(center.x - 20, center.y - 20, 5, 0, 2 * Math.PI); // circle - 15 ball's color
				context.fillStyle = config['15_balls']; //color
				context.fill();
			} else if (board[i][j][len] == 5) { // 25 balls
				context.beginPath();
				context.arc(center.x - 20, center.y - 20, 5, 0, 2 * Math.PI); // circle - 25 ball's color
				context.fillStyle = config['25_balls']; //color
				context.fill();
			} else if (board[i][j][len] == 2) { // obstacles
				context.beginPath();
				context.rect(center.x - 40, center.y - 40, 40, 40);
				context.fillStyle = "grey"; //color
				context.fill();
			}else if (board[i][j][len] == 6)
				context.drawImage(ghost1Img, center.x-40, center.y-40, 40, 40);
			else if (board[i][j][len] == 7)
				context.drawImage(ghost2Img, center.x-40, center.y-40, 40, 40);
			else if (board[i][j][len] == 8) 
				context.drawImage(ghost3Img, center.x-40, center.y-40, 40, 40);
			else if (board[i][j][len] == ids.ghost4_id)
				context.drawImage(ghost4Img, center.x-40, center.y-40, 40, 40);
			else if (board[i][j][len] == ids.clock_id)
				context.drawImage(clockImg, center.x-40, center.y-40, 40, 40);	
			else if (board[i][j][len] == ids.strawberry_id)
				context.drawImage(foodImg, center.x-40, center.y-40, 40, 40);	
		}
	}
}

function UpdatePosition() {
	if(in_game){
		board[shape.i][shape.j][0] = ids.empty_id; // empty
		move_dire = GetKeyPressed();  //the current press
		// console.log("UPDATE");
		// console.log(move_dire);
		if (move_dire == 1) {
			if (shape.j > 0 && board[shape.i][shape.j - 1][0] != 2) {
				shape.j--;
			}
			shape.key = 1;
		}
		else if (move_dire == 2) {
			if (shape.j < y_size && board[shape.i][shape.j + 1][0] != 2) {
				shape.j++;
			}
			shape.key = 2;
		}
		else if (move_dire == 3) {
			if (shape.i > 0 && board[shape.i - 1][shape.j][0] != 2) {
				shape.i--;
			}
			shape.key = 3;
		}
		else if (move_dire == 4) {
			if (shape.i < x_size && board[shape.i + 1][shape.j][0] != 2) {
				shape.i++;
			}
			shape.key = 4;
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
		let currentTime = new Date();
		time_elapsed = (currentTime - start_time) / 1000;
		if((currentTime - countClock)/1000 >= 20 && !addClock){
			let place = findRandomEmptyCell();
			clock.row = place[0];
			clock.col = place[1];
			board[place[0]][place[1]] = [ids.clock_id];
			addClock = true;
		}

		if(check_collision())
			ghost_collision();

		if(check_stawberry())
			strawberry_collision();
		if(clock.row == shape.i && clock.col == shape.j && addClock){
			eaten_clock();
		}
		//end game when there is no lives
		if(num_invalidation == 0){    
			$("#lblInvalidation").text(num_invalidation);        
			window.clearInterval(interval);
			window.clearInterval(intervalGhost);
			pause_game();
			window.alert("Loser!");
		}
		else if(time_elapsed >= config['game_time']){
			if(score < 100){
				window.clearInterval(interval);
				window.clearInterval(intervalGhost);
				pause_game();
				window.alert("You are better then " + score + " points!");
			}
			else{
				window.clearInterval(interval);
				window.clearInterval(intervalGhost);
				pause_game();
				window.alert("Winner!!!");
			}
		}
		else {
			Draw();
		}
	}
}

function eaten_clock(){
	board[clock.row][clock.col] = [ids.packman_id];
	config["game_time"] += 30; 
	//$("#valTime").text(config['game_time']);
	countClock = new Date();
	addClock = false;
	//Draw();	
}

//find if there isn't obstical in this place on board
function emptyPlace(i, j){
	if(board[i][j][0] == 2)
		return false;
   return true;
}

function UpdatePositionStrawberry(){
	let strawberryPos = board[strawberry.row][strawberry.col];
	if(strawberryPos.length == 1){
		board[strawberry.row][strawberry.col][0] = 0;
	}
	else{
		let idx = strawberryPos.indexOf(ids.strawberry_id);
		board[strawberry.row][strawberry.col].splice(idx, 1);
	}
	let isEmpty = false;
	while(!isEmpty){
		let number = Math.floor(Math.random() * 4) + 1;
		if(number == 1 && emptyPlace(strawberry.row-1,strawberry.col)){ //up
			strawberry.row = strawberry.row - 1;
			isEmpty=true;
		} else if(number == 2 && emptyPlace(strawberry.row+1,strawberry.col)){ //down
			strawberry.row = strawberry.row + 1;
			isEmpty=true;
		}else if(number == 3 && emptyPlace(strawberry.row,strawberry.col-1)){ //left
			strawberry.col = strawberry.col - 1;
			isEmpty=true;
		}else if(number == 4 && emptyPlace(strawberry.row,strawberry.col+1)){ //right
			strawberry.col = strawberry.col + 1;
			isEmpty=true;
		}
	}
	if(board[strawberry.row][strawberry.col].length == 1 && board[strawberry.row][strawberry.col][0] == 0)
		board[strawberry.row][strawberry.col] = [ids.strawberry_id];
	else
		board[strawberry.row][strawberry.col].push(ids.strawberry_id);
}



function intervalUpdateGhosts(){
	if(in_game){
		UpdatePositionStrawberry();
		for (let i=0; i<config['ghost_num']; i++) {
			let tmp_row = ghost_pos[i].row;
			let tmp_col = ghost_pos[i].col;
			//remove ghost from last ghost
			if(board[ghost_pos[i].row][ghost_pos[i].col].length == 1){
				board[ghost_pos[i].row][ghost_pos[i].col] = [0];
			}
			else{
				let ind = findghost(6+i, ghost_pos[i].row, ghost_pos[i].col);
				let len = board[ghost_pos[i].row][ghost_pos[i].col].length - 1;
				board[ghost_pos[i].row][ghost_pos[i].col].splice(ind,1);
			
			}
			let arr_pos = UpdatePositionGhost(ghost_pos[i]);
			if(arr_pos == 0){
				board[ghost_pos[i].row][ghost_pos[i].col] = [6+i];
			}
			else // if(arr_pos == 1)
				board[ghost_pos[i].row][ghost_pos[i].col].push(6+i);
			ghost_pos[i].last_row = tmp_row;
			ghost_pos[i].last_col = tmp_col;
		}
	}
	Draw();
	
}

function UpdatePositionGhost(obj){
	if(obj != undefined){
		let pos = {"Up": [obj.row-1, obj.col],
					"Down": [obj.row+1, obj.col],
					"Left": [obj.row, obj.col-1],
					"Right": [obj.row, obj.col+1]} 
		let moves = {} // {up: 0, down: 0, left: 0, right: 0}; 
		moves["Up"] = Math.abs(shape.i-(obj.row-1))+Math.abs(shape.j-obj.col) //up
		moves["Down"] = Math.abs(shape.i-(obj.row+1))+Math.abs(shape.j-obj.col) //down
		moves["Left"] = Math.abs(shape.i-obj.row)+Math.abs(shape.j-(obj.col-1)) //left
		moves["Right"] = Math.abs(shape.i-obj.row)+Math.abs(shape.j-(obj.col+1)) //right
		let min = 0;
		let min_move = null;
		let keys = Object.keys(moves);
		let values = Object.values(moves);
		let positions = Object.values(pos);
		// const [move, value] of Object.entries(moves)
		for (let i=0; i<4; i++) {
			let key = keys[i]; // will be up, down, left and right
			let move = positions[i]; //place in the board list-[x,y]
			let place_val = values[i];
			let arr_pos = check_position(move[0], move[1], obj);
			if(move[0] > x_size-1 || move[0] < 0 || move[1] > y_size-1 || move[1] < 0)
				continue
			if(min_move == null && arr_pos != -1){
				min_move = move;
				min = place_val
			}
			else if(place_val < min && arr_pos != -1){
				min = place_val;
				min_move = move;
			}
		}
		if(min_move != undefined){
			obj.row = min_move[0];
			obj.col = min_move[1];
		}
		return check_position(obj.row, obj.col, null);
	}
}

//check where to put ghost in the squre's array 
function check_position(i, j, ghost){
	let arr_plc = board[i][j];
	//ghosts
	for(let k=0; k<4; k++){
		let sec_con = findghost(6+k, i, j);
		if(sec_con != -1) //find ghost
			return -1;
	}
	//opstacals 
	if(arr_plc[0] == 2){   
		return -1;
	}
	//check if the move is vaild
	if(ghost != null && ghost.last_row == i && ghost.last_col == j){
		return -1;
	}
	//empty cell
	if(arr_plc[0] == 0) {
		return 0;
	}//balls
	if(board[i][j][0] == 3 || board[i][j][0] == 4 || board[i][j][0] == 5){
		// if(board[i][j].lenght > 1 && board[i][j][1] == 11 )
		// 	return board[i][j].lenght;
		return 1;
	}
	return 1;

}

 //find the first index of the element
function findghost(val, row, col){
	// for(let k=0; k<board[row][col].length; k++){
		// if(board[row][col][k] == val)
		// 	return k;
	// }
	if(board[row][col][0] == val)
		return 0;
	if(board[row][col][1] == val)
		return 1;
	return -1;
}

function check_stawberry(){
	return (strawberry.row == shape.i && strawberry.col == shape.j)
}

function check_collision(){
	for(let i = 0; i< config['ghost_num']; i++){
		if(ghost_pos[i].row == shape.i && ghost_pos[i].col == shape.j){
			return true;
		}
	}
	return false;
}

function strawberry_collision(){
	score+=50;
	put_strawberry();
}

function ghost_collision(){ ////////////
	score-=10;
	num_invalidation-=1;
	for (let i=0; i<config['ghost_num'];i++) {
		let tmp_row = ghost_pos[i].row;
		let tmp_col = ghost_pos[i].col;
		//remove ghost from last ghost
		if(board[ghost_pos[i].row][ghost_pos[i].col].length == 1){
			board[ghost_pos[i].row][ghost_pos[i].col] = [0];
		}
		else{
			let ind = findghost(6+i, ghost_pos[i].row, ghost_pos[i].col);
			board[ghost_pos[i].row][ghost_pos[i].col].splice(ind,1);
	
		}
	}
	board[shape.i][shape.j] = [0];
	put_ghosts();
	put_pacman();
}


function pause_game(){
	in_game = false;
	music_play.pause();
}

function openPage(pageName) {
	if(in_game && pageName != "Game"){
		canvas.width = canvas.width;
		pause_game();
	}
	// Hide all elements with class="tabcontent" by default */
	let i, tabcontent, tablinks;
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
}

