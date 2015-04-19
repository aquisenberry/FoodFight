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
        },
        "mouseUp":{
            "strip": "animations/mouseUp.png",
            "frames": 2,
            "msPerFrame": 70
        },
        "mouseDown":{
            "strip": "animations/mouseUp.png",
            "frames": 2,
            "msPerFrame": 70,
            "flip":"vertical"
        },
        "hotdog":{
            "strip": "animations/hotDog.png",
            "frames": 1,
            "msPerFrame": 100
        },
        "tomato-1":{
            "strip": "animations/tomato.png",
            "frames": 1,
            "msPerFrame": 100
        },
        "tomato-2":{
            "strip": "animations/tomato.png",
            "frames": 1,
            "msPerFrame": 100,
            "flip": "horizontal"
        },
        "spaghetti-1":{
            "strip": "animations/spaghetti.png",
            "frames": 1,
            "msPerFrame": 100
        },
        "spaghetti-2":{
            "strip": "animations/spaghetti.png",
            "frames": 1,
            "msPerFrame": 100,
            "flip": "horizontal"
        },
        "impactTomato-1":{
            "strip": "animations/spaghetti.png",
            "frames": 4,
            "msPerFrame": 50
        },
        "impactTomato-2":{
            "strip": "animations/spaghetti.png",
            "frames": 4,
            "msPerFrame": 50,
            "flip": "horizontal"
        },
        "impactSpaghetti-1":{
            "strip": "animations/spaghetti.png",
            "frames": 3,
            "msPerFrame": 50,
            "flip": "horizontal"
        },
        "impactSpaghetti-2":{
            "strip": "animations/spaghetti.png",
            "frames": 3,
            "msPerFrame": 50,
            "flip": "horizontal"
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

// Starts a throw by creating AnimatedEntity and giving it velocity.
function chuck(player) { // TODO: will need to receive a 'weapon' attribute.
    var projectile = new Splat.AnimatedEntity(player.x, player.y, 20, 20, game.animations.get(player.arsenal[player.selectedWeapon].weapon), 10, 10);
    projectile.vx = player.arsenal[player.selectedWeapon].velocity;
    projectile.vy = 0;
    player.projectiles.push(projectile);
}

// Draws the projectiles from a player.
function chucker(player, context) {
    player.projectiles.forEach(function (projectile) {
        projectile.draw(context);
    });
}

// Calculates the new position of a player's projectiles.
function chucking(player, elapsedMillis) {
    player.projectiles.forEach(function (projectile) {
        projectile.move(elapsedMillis);
    });
}

function collision(player, projectile) {
    hitAnimation(player);
    player.health -= projectile.impact;
    if (player.health <= 0) {
        endGame(player);
    }
}

function endGame(player) {
    console.log(player.nemisis.sprite + " WINNSSSSSSS!!!!");
}

function hitting(player) {
    var projectiles = player.nemesis.projectiles;
    for(var i = 0; i< projectiles.length;i++){
    	if(player.collides(projectiles[i])){
    	    console.log("OUCH!!!!");
            collision(player, projectile);
    	    player.nemesis.projectiles.splice(i,1);
    	}
    }
}

function hitAnimation(player) {
    return new Splat.Timer(function () {}, 200, function() {
        var sprite = player.arsenal[player.selectedWeapon].weapon + "impact"; 
        this.stop();
        this.reset();
        player.sprite = sprite;
    });
}

function throwTimer(player,sprite){
    console.log("here");
    return new Splat.Timer(function(){}, 300,function(){
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
    this.upAnim = game.animations.get("mouseUp");
    this.downAnim = game.animations.get("mouseDown");
    var hotdogImg = game.animations.get("hotdog");
    var tomatoImageR = game.animations.get("tomato-1");
    var tomatoImagel = game.animations.get("tomato-2");
    var spaghettiImageR = game.animations.get("spaghetti-1");
    var spaghettiImageL = game.animations.get("spaghetti-2");

    //create entities
    this.bg = new Splat.AnimatedEntity(0,0,canvas.width,canvas.height,bgImage,0,0);
    //indicators
    this.hotdogIndicator1 = new Splat.AnimatedEntity(50, canvas.height- (hotdogImg.height+30), hotdogImg.width, hotdogImg.height, hotdogImg,0,0);
    this.hotdogIndicator2 = new Splat.AnimatedEntity(canvas.width -(hotdogImg.width+30),canvas.height-(hotdogImg.height+30),hotdogImg.width,hotdogImg.height,hotdogImg,0,0);
    this.tomatoIndicator1 = new Splat.AnimatedEntity(50, canvas.height- (tomatoImageR.height+30), tomatoImageR.width, tomatoImageR.height, tomatoImageR,0,0);
    this.tomatoIndicator2 = new Splat.AnimatedEntity(canvas.width -(tomatoImagel.width+30),canvas.height-(tomatoImagel.height+30),tomatoImagel.width,tomatoImagel.height,tomatoImagel,0,0);
    this.spaghettiIndicator1 = new Splat.AnimatedEntity(50, canvas.height- (spaghettiImageR.height+30), spaghettiImageR.width, spaghettiImageR.height, spaghettiImageR,0,0);
    this.spaghettiIndicator2 = new Splat.AnimatedEntity(canvas.width -(spaghettiImageL.width+30),canvas.height-(spaghettiImageL.height+30),spaghettiImageL.width,spaghettiImageL.height,spaghettiImageL,0,0);
    //player1
    this.player1 = new Splat.AnimatedEntity(0,this.canvas.height/2 -p1Img.height/2,p1Img.width/2,p1Img.height,p1Img,0,0);
    this.player1.arsenal = [
	{
	    weapon:"hotdog",
	    spriteHit:"hotdog",
	    impact:10,
	    velocity:0.8
	},
	{
	    weapon:"tomato-1",
	    spriteHit:"impactTomato-1Impact",
	    impact:10,
	    velocity:0.5
	},
	{
	    weapon:"spaghetti-1",
	    spriteHit:"impactSpaghetti-1Impact",
	    impact:10,
	    velocity:1.4
	}
    ];
    this.player1.selectedWeapon = 0;
    this.player1.chuck = function(){
	chuck(this);
    };
    this.player1.projectiles = [];

    //player2	
    this.player2 = new Splat.AnimatedEntity(canvas.width - p2Img.width,this.canvas.height/2 -p2Img.height/2,p2Img.width/2,p2Img.height,p2Img,0,0);
    this.player2.arsenal = [
	{
	    weapon:"hotdog",
	    spriteHit:"hotdog",
	    impact:10,
	    velocity:-0.8
	},
	{
	    weapon:"tomato-2",
	    spriteHit:"impactTomato-2Impact",
	    impact:10,
	    velocity:-0.5
	},
	{
	    weapon:"spaghetti-2",
	    spriteHit:"spaghetti-2Impact",
	    impact:10,
	    velocity:-1.4
	}
    ];
    this.player2.selectedWeapon = 0;
    this.player2.chuck = function(){
	chuck(this);
    };
    this.player2.projectiles = [];
    
    this.player1.nemesis = this.player2;
    this.player2.nemesis = this.player1;

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
    hitting(this.player1);
    hitting(this.player2);
    
    ///////player 1 controls
    if (game.keyboard.isPressed("w")  && this.player1.y > this.upperbound &&!this.timers.p1Throw.running){
	this.player1.y -= this.playerSpeed;
	this.player1.sprite = this.upAnim;
    }
    else if (game.keyboard.isPressed("s") && this.player1.y+this.player1.height < this.lowerbound && !this.timers.p1Throw.running){
	this.player1.y += this.playerSpeed;
	this.player1.sprite = this.downAnim;
    }
    else{
    	if(!this.timers.p1Throw.running){
    		this.player1.sprite = game.animations.get("player1");
    	}
    }
    if (game.keyboard.consumePressed("d") && !game.keyboard.isPressed("w") && !game.keyboard.isPressed("s") && !this.timers.p1Throw.running){
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
    if (game.keyboard.isPressed("up")  && this.player2.y > this.upperbound && !this.timers.p2Throw.running){
	this.player2.y -= this.playerSpeed;
	this.player2.sprite = this.upAnim;
    }
    else if (game.keyboard.isPressed("down") && this.player2.y + this.player2.height < this.lowerbound && !this.timers.p2Throw.running){
	this.player2.y += this.playerSpeed;
	this.player2.sprite = this.downAnim;
    }
    else{
    	if(!this.timers.p2Throw.running){
			this.player2.sprite = game.animations.get("player2");
    	}
    }
    if (game.keyboard.consumePressed("left")&& !game.keyboard.isPressed("up") && !game.keyboard.isPressed("down") && !this.timers.p2Throw.running){

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
		this.hotdogIndicator1.draw(context);
		break;
    case 1:
		this.tomatoIndicator1.draw(context);
		break;
    case 2:
    	this.spaghettiIndicator1.draw(context);
		break;
    }
    switch(this.player2.selectedWeapon){
    case 0:
		this.hotdogIndicator2.draw(context);
		break;
    case 1:
		this.tomatoIndicator2.draw(context);
		break;
    case 2:
		this.spaghettiIndicator2.draw(context);
		break;
    }
    chucker(this.player1, context);
    chucker(this.player2, context);
    //context.font = "25px helvetica";
    //centerText(context, "Blank SplatJS Project", 0, canvas.height / 2 - 13);

}));


game.scenes.switchTo("loading");
