"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
	},
	"sounds": {
	},
	"fonts": {
	},
	"animations": {
	}
};

var game = new Splat.Game(canvas, manifest);

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
	var y = offsetY | 0;
	context.fillText(text, x, y);
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization

}, function() {
	// simulation
	if(game.mouse.consumePressed(0)){
		game.scenes.switchTo("main");
	}
	// this.buttons.push( new Splat.Button(game.mouse,canvas.width/2 - playBtnImage.width/2,220 + canvas.height/2 - playBtnImage.height/2, { normal: playBtnImage, pressed: playBtnImage }, function(state) {
	// 	if (state === "pressed"){
	// 	}
	// }));
}, function(context) {
	// draw
	context.fillStyle = "#092227";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#fff";
	context.font = "25px helvetica";
	centerText(context, "Hello Splat", 0, canvas.height / 2 - 13);
}));

game.scenes.add("main", new Splat.Scene(canvas, function() {
	// initialization
	this.player1 = {
		x:100,
		y:0,
		width:20,
		height:20
	};
	this.player2 = {
		x:canvas.width - 120,
		y:0,
		width:20,
		height:20
	};
	this.playerSpeed = 2;
}, function() {
	// simulation

	///////player 1 controls
	if (game.keyboard.isPressed("w")){
		this.player1.y -= this.playerSpeed;
	}
	if (game.keyboard.isPressed("s")){
		this.player1.y += this.playerSpeed;
	}
	if (game.keyboard.consumePressed("d")){
		console.log("fire1");
		//TODO:fire projectile
	}
	//////player 2 controls
	if (game.keyboard.isPressed("up")){
		this.player2.y -= this.playerSpeed;
	}
	if (game.keyboard.isPressed("down")){
		this.player2.y += this.playerSpeed;
	}
	if (game.keyboard.consumePressed("left")){
		console.log("fire2");
		//TODO:fire projectile
	}

}, function(context) {
	// draw
	context.fillStyle = "#092fff";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#fff";
	context.fillRect(this.player1.x, this.player1.y, this.player1.width, this.player1.height);
	context.fillRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height);
	//context.font = "25px helvetica";
	//centerText(context, "Blank SplatJS Project", 0, canvas.height / 2 - 13);
}));


game.scenes.switchTo("loading");
