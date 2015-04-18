/*jslint debug: true */
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
	"background": {
            "strip": "animations/board.png",
            "frames": 1,
            "msPerFrame": 100
        },
        "player1":{
        	"strip": "animations/mouseSmallSide1.png",
            "frames": 1,
            "msPerFrame": 100
        },
        "player2":{
        	"strip": "animations/mouseSmallSide1P2.png",
            "frames": 1,
            "msPerFrame": 100
        },
        "mouseThrow":{
        	"strip": "animations/mouseThrow.png",
            "frames": 3,
            "msPerFrame": 100
        },
        "mouseThrow2":{
        	"strip": "animations/mouseThrowP2.png",
            "frames": 3,
            "msPerFrame": 100
        }
    }
};

var game = new Splat.Game(canvas, manifest);

function centerText(context, text, offsetX, offsetY) {
    var w = context.measureText(text).width;
    var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
    var y = offsetY | 0;
    context.fillText(text, x, y);
}

function chuck(player, vx) {
    var projectile = new Splat.AnimatedEntity(player.x, player.y, 20, 20, game.animations.get("player1"), 10, 10);
    projectile.vx = vx;
    projectile.vy = 0;
    player.projectiles.push(projectile);
}

function chucker(player, context) {
    player.projectiles.forEach(function (projectile) {
        projectile.draw(context);
    });
}

function chucking(player, elapsedMillis) {
    player.projectiles.forEach(function (projectile) {
        projectile.move(elapsedMillis);
    });
}
function throwTimer(player,sprite){
	console.log("here");
	return new Splat.Timer(function(){}, 300,function(){
		console.log(this);
		this.stop();
		this.reset();
		player.sprite = sprite;
	});
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
	//declare images
	var bgImage = game.animations.get("background");
	//var mouseThrow = game.animations.get("mouseThrow");
	var p1Img = game.animations.get("player1");
	var p2Img = game.animations.get("player2");

	//create entities
	this.bg = new Splat.AnimatedEntity(0,0,canvas.width,canvas.height,bgImage,0,0);
	//player1
	this.player1 = new Splat.AnimatedEntity(0,this.canvas.height/2 -p1Img.height/2,p1Img.width,p1Img.height,p1Img,0,0);
	this.player1.arsenal = [
		{
			weapon:"weapon1"
		},
		{
			weapon:"weapon2"
		},
		{
			weapon:"weapon3"
		}
	];
	this.player1.selectedWeapon = 0;
	this.player1.chuck = function(){
		chuck(this,1);
	};
	this.player1.projectiles = [];

	//player2	
	this.player2 = new Splat.AnimatedEntity(canvas.width - p2Img.width,this.canvas.height/2 -p2Img.height/2,p2Img.width,p2Img.height,p2Img,0,0);
	this.player2.arsenal = [
		{
			weapon:"weapon1"
		},
		{
			weapon:"weapon2"
		},
		{
			weapon:"weapon3"
		}
	];
	this.player2.selectedWeapon = 0;
	this.player2.chuck = function(){
		chuck(this,-1);
	};
	this.player2.projectiles = [];
	

	//define scene variables
	this.upperbound = 70;
	this.lowerbound = canvas.height - 70;
	this.playerSpeed = 2;
	this.timers.p1Throw = throwTimer(this.player1,p1Img);
	this.timers.p2Throw = throwTimer(this.player2,p2Img);
}, function(elapsedMillis) {
	// simulation
	chucking(this.player1, elapsedMillis);
    chucking(this.player2, elapsedMillis);
	///////player 1 controls
	if (game.keyboard.isPressed("w")  && this.player1.y > this.upperbound){
		this.player1.y -= this.playerSpeed;
	}
	if (game.keyboard.isPressed("s") && this.player1.y+this.player1.height < this.lowerbound){
		this.player1.y += this.playerSpeed;
	}
	if (game.keyboard.consumePressed("d")){
		console.log("fire1");
		this.timers.p1Throw.start();
		this.player1.sprite = game.animations.get("mouseThrow");
		this.player1.chuck();
		
		//TODO:fire projectile
	}
	if (game.keyboard.consumePressed("a")){
		this.player1.selectedWeapon +=1;
		if(this.player1.selectedWeapon > 2){
			this.player1.selectedWeapon = 0;
		}
	}
	//////player 2 controls
	if (game.keyboard.isPressed("up")  && this.player2.y > this.upperbound){
		this.player2.y -= this.playerSpeed;
	}
	if (game.keyboard.isPressed("down") && this.player2.y + this.player2.height < this.lowerbound){
		this.player2.y += this.playerSpeed;
	}
	if (game.keyboard.consumePressed("left")){
		console.log("fire2");

		this.player2.sprite = game.animations.get("mouseThrow2");
		this.timers.p2Throw.start();
		this.player2.chuck();
		//TODO:fire projectile
	}
	if (game.keyboard.consumePressed("right")){
		this.player2.selectedWeapon +=1;
		if(this.player2.selectedWeapon > 2){
			this.player2.selectedWeapon = 0;
		}
	}
	this.player1.move(elapsedMillis);
	this.player2.move(elapsedMillis);
}, function(context) {
	// draw
	context.fillStyle = "#092fff";
	this.bg.draw(context);

	context.fillStyle = "#ff0000";
	//context.fillRect(this.player1.x, this.player1.y, this.player1.width, this.player1.height);
	//context.fillRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height);
	
	this.player1.draw(context);
	this.player2.draw(context);	
	switch(this.player1.selectedWeapon){
		case 0:
			context.fillStyle = "#ff0000";
			break;
		case 1:
			context.fillStyle = "#00ff00";
			break;
		case 2:
			context.fillStyle = "#0000ff";
			break;
	}
	context.fillRect(50,canvas.height- 50,20,20);
	switch(this.player2.selectedWeapon){
		case 0:
			context.fillStyle = "#ff0000";
			break;
		case 1:
			context.fillStyle = "#00ff00";
			break;
		case 2:
			context.fillStyle = "#0000ff";
			break;
	}
	context.fillRect(canvas.width -70,canvas.height-50,20,20);
	chucker(this.player1, context);
    chucker(this.player2, context);
	//context.font = "25px helvetica";
	//centerText(context, "Blank SplatJS Project", 0, canvas.height / 2 - 13);

}));


game.scenes.switchTo("loading");
