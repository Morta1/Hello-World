var Game = function(){
	this.boxes = new Array();
	this.gamePoints = 0;
	this.totalBoxes = 6;
	this.gameTimer = null;
	this.duration = null;
	this.bestScore = localStorage.getItem('bestScore');

	//dom objs
	this.timer = null;
	this.points = null;
	this.field = document.getElementById('field');
	this.btn = document.createElement('button');
	this.bScore = document.createElement('p');
	var _this = this;

	//sound
	this.s_game = new Audio("sound/gamesound.mp3");

	this.btn.innerHTML = 'Start Game';
	this.btn.addEventListener('click', function(){
		if(_this.duration > 0){
			_this.endGame();
		}
		else{
			_this.startGame();
		}
	});

	for (var i = 0; i < this.totalBoxes; i++) {
		this.boxes[i] = new Box(this.getRandom(0,730));
		this.field.appendChild(this.boxes[i].getDomObj());
	}

	//scoreboard
	var scoreboard = document.createElement('div');
	scoreboard.className = 'scoreboard';
	this.timer = document.createElement('p');
	this.timer.className = "game-timer";
	this.timer.innerHTML = "0";
	this.points = document.createElement('p');
	this.points.className = "game-points";
	this.points.innerHTML = "0";
	this.bScore.className = "best";

	if (this.bestScore){
		this.bScore.innerHTML = 'Best Score : ' + this.bestScore;
	}
	else{
		this.bScore.innerHTML = 'Best Score : 0';
	}

	scoreboard.appendChild(this.bScore);
	scoreboard.appendChild(this.btn);
	scoreboard.appendChild(this.timer);
	scoreboard.appendChild(this.points);
	this.field.appendChild(scoreboard);

	//events
	document.addEventListener('pop', function(e){
		_this.gamePoints += e.detail;
		_this.showGamePoints();
	});
}

Game.prototype = {
	startGame : function(){
		//sound
		this.s_game.currentTime=0;
		this.s_game.play();
		//resetting box postion
		for (var i = 0; i < this.totalBoxes; i++) {
			this.boxes[i].setBoxPos(this.getRandom(0,730));
			this.boxes[i].setBoxAction({t:"ctr", p:null});
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

	gameBeat : function(){
		if(this.duration > 0){
			for (var i = 0; i < this.totalBoxes; i++) {
				this.boxes[i].setBoxAction(this.getActionParam());
			}
			var _this = this;
			setTimeout(function(){
				_this.gameBeat();
			}, 1500);
		}
		else{
			this.endGame();
		}
	},

	endGame : function(){
		this.duration = 0;
		this.s_game.currentTime=0;
		this.s_game.pause();
		this.btn.innerHTML = "Start Game";
		if (this.gamePoints > this.bestScore){
			localStorage.setItem('bestScore', this.gamePoints);
			this.bScore.innerHTML = 'Best Score : ' + this.gamePoints;
		}
	},

	getActionParam : function(){
		var rand = this.getRandom(1,3);
		return {t:"ctr s" + rand, p: rand * 2};
	},

	getRandom : function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min)
	},

	showGamePoints : function(){
		this.points.innerHTML = this.gamePoints;
	}
};

(function(){
	var init = new Game();
})();
