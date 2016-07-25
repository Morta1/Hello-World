var Game = function(){
	var _this = this;
	//properties
	//game data
	this.pikas = new Array();
	this.totalPikas = 10;
	this.gamePoints = 0;
	this.gameTimer = null; //timer obj
	this.duration = null; //timer duration

	//dom obj
	this.points = null; //points obj
	this.timer = null; //timer dom obj
	this.field = document.getElementById('field');
	this.btn = null;

	//sounds
	this.s_hit = new Audio("sound/plop.wav");; // hammer hit
	this.s_ouch = new Audio("sound/pika.wav"); // pika hit
	this.s_game = new Audio("sound/gamesound.mp3"); // game running

	var pikaPos = this.calcPikaPos();

	for (var i = 0; i < this.totalPikas; i++){
		this.pikas[i] = new Pika(pikaPos[i]);
		this.field.appendChild(this.pikas[i].getDomObj());
	}

	//add start button
	this.btn = document.createElement('button');
	this.btn.innerHTML = "Start Game";
	this.btn.addEventListener('click', function(){
		if(_this.duration > 0){
			_this.endGame();
		}
		else{
			_this.startGame();
		}
	});
	this.field.appendChild(this.btn);	

	//catch whack event (update score)
	document.addEventListener('whack', function(e){	
		_this.s_ouch.currentTime=0;
		_this.s_ouch.play();
		_this.gamePoints += e.detail;
		_this.showGamePoints();
	});

	//scoreboard
	this.timer = document.createElement('p');
	this.timer.className = "game-timer";
	this.timer.innerHTML = "0";
	this.points = document.createElement('p');
	this.points.className = "game-points";
	this.points.innerHTML = "0";
	var scoreboard = document.createElement('div');
	scoreboard.className = 'scoreboard';
	scoreboard.appendChild(this.timer);
	scoreboard.appendChild(this.points);
	this.field.appendChild(scoreboard);

	//mouse events
	this.field.addEventListener('mousedown',function() {
		_this.s_hit.currentTime=0;
		_this.s_hit.play();
		_this.field.className = 'md';		
	});
	this.field.addEventListener('mouseup',function() {
		_this.field.className = '';
	});
};

Game.prototype =  {

	startGame : function(){
		//sound
		this.s_game.currentTime=0;
		this.s_game.play();
		//resetting pikas position
		var pikaPos = this.calcPikaPos();
		for (var i = 0; i < this.totalPikas; i++) {
			this.pikas[i].setPikaPos(pikaPos[i]);
			this.pikas[i].setPikaAction({t:'',p:null});
		}
		//reset game attributes
		this.gamePoints = 0;
		this.showGamePoints();
		this.duration = 20;
		this.timer.innerHTML = this.duration;
		this.btn.innerHTML = "Stop Game";

		//run game timer
		var _this = this;
		this.gameTimer = setInterval(function(){
			_this.timer.innerHTML = _this.duration;
			if (--_this.duration < 0){
				clearInterval(_this.gameTimer);
				_this.gameTimer = 0;
			}
		}, 1000);

		this.gameBeat();
	},

	endGame : function(){
		this.s_game.currentTime=0;
		this.s_game.pause();
		this.duration = 0;
		this.btn.innerHTML = "Start Game";

		// //Modal
		// //create the modal
		// var modal = document.createElement('div');
		// var content = document.createElement('div');
		// var close = document.createElement('div');
		// var overlay = document.createElement('div');
		// var title = document.createElement('div');
		// var p = document.createElement('p');

		// //id and classes
		// modal.className = "modal";
		// content.className = "content";
		// close.className = "close";
		// overlay.className = "overlay";
		// title.className = 'title';

		// //text
		// title.innerHTML = "Game Over!";
		// p.innerHTML = "Your score is : " + this.gamePoints;

		// //apending
		// content.appendChild(title);
		// content.appendChild(close);
		// content.appendChild(p);
		// modal.appendChild(content);
		// modal.appendChild(overlay);

		// this.field.appendChild(modal);

		// //Modal events
		// modal.style.display = "block";
			
		// close.addEventListener('click', function(){
		// 	modal.style.display = "none";
		// });
	
		// overlay.addEventListener('click', function(){
		// 	modal.style.display = "none";
		// });
	},

	gameBeat : function(){
		if(this.duration > 0){
			for (var i = 0; i < this.totalPikas; i++) {
				this.pikas[i].setPikaAction(this.getActionParam());
			}
			var _this = this;
			setTimeout(function(){
				_this.gameBeat();
			}, 2500);
		}
		else{
			this.endGame();
		}
	},

	showGamePoints : function(){
		this.points.innerHTML = this.gamePoints;
	},

	getRandom : function(min, max){
		return Math.floor((Math.random() * max - min + 1) + min);
	},

	getActionParam : function(){
		var rand = this.getRandom(1,3);
		return {t:"s" + rand, p: rand * 2};
	},

	calcPikaPos : function(){
		var result = new Array();
		//field height and width
	    var height = document.getElementById('field').clientHeight;
	    var width = document.getElementById('field').clientWidth;

	    var generatePos = function(){
	        // generates the random x and y position, taking into account the size of the object
	        var posY = Math.floor(Math.random() * (height - 190) + 90);
	        var posX = Math.floor(Math.random() * (width - 100));
	        return {x: posX, y: posY};
	    }

	    var checkOverlap = function(x, y){
	        var overlap = false
	        // loops through existing objects and makes sure the newly generated one doesn't overlap
	        for (var j = 0; j < result.length; j++){
	            var yDiff = Math.abs(result[j].y - y);
	            var xDiff = Math.abs(result[j].x - x);
	            if (yDiff < 100 && xDiff < 100){
	                overlap = true;
	            }
	        }
	        return overlap;
	    }

	    for (var i = 0; i < this.totalPikas; i++) {
	        var obj = {};
	        var pos = generatePos();
	        //first time running
	        if (result.length == 0){
	            obj.x = pos.x;
	            obj.y = pos.y;
	            result.push(obj);
	        }
	        else{
	            var overlap = checkOverlap(pos.x, pos.y) 
	            if(!overlap){
	                obj.x = pos.x;
	                obj.y = pos.y ;
	                result.push(obj);
	            }
	            else{
	                i--;
	            }
	        }
	    }
	    return result;
	}
};

(function(){
	var init = new Game();
})();