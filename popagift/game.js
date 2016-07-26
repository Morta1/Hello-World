var Game = function(){
	//game data
	this.boxes = new Array();
	this.gamePoints = 0;
	this.totalBoxes = 7;
	this.gameTimer = null;
	this.duration = null;
	this.bestScore = localStorage.getItem('bestScore');
	this.stopped = false;

	//dom objs
	this.timer = null;
	this.points = null;
	this.field = document.getElementById('field');
	this.btn = document.createElement('button');
	this.bScore = document.createElement('p');
	var _this = this;

	//sound
	this.s_game = new Audio("sound/gamesound.mp3");
	this.s_giftPop = new Audio("sound/popsound.mp3");

	this.btn.innerHTML = 'Start Game';
	this.btn.addEventListener('click', function(){
		if(_this.duration > 0){
			_this.stopped = true;
			_this.endGame();
		}
		else{
			var modal = document.getElementsByClassName('modal')[0];
			if (modal){
				_this.field.removeChild(modal);
			}
			_this.stopped = false;
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
		_this.gamePoints += e.detail.myPoints;
		_this.showGamePoints();
		_this.s_giftPop.currentTime=0.5;
		_this.s_giftPop.play();	
		var span = e.detail.ctr.children[0];
		var myPoints = e.detail.myPoints;
		span.className = 'add-points';
		span.innerHTML = "+" + myPoints;
		console.log('Added: ', myPoints, 'Game points: ', _this.gamePoints);
		span.addEventListener('animationend', function(){
			span.className = '';
			span.innerHTML = '';
		});
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
		//keep the game running while checking if duration is not 0
		if(this.duration > 0){
			for (var i = 0; i < this.totalBoxes; i++) {
				var obj = this.getActionParam();
				this.boxes[i].setBoxAction(obj);
			}
			var _this = this;
			setTimeout(function(){
				_this.gameBeat();
			}, 2500);
		}
		else{
			if (!this.stopped){
				this.endGame();
			}
		}
	},

	endGame : function(){
		//resetting game and pop up a modal
		this.duration = 0;
		this.s_game.currentTime=0;
		this.s_game.pause();
		this.btn.innerHTML = "Start Game";
		if (this.gamePoints > this.bestScore){
			localStorage.setItem('bestScore', this.gamePoints);
			this.bScore.innerHTML = 'Best Score : ' + this.gamePoints;
		}

		//Modal
		//create the modal
		var modal = document.createElement('div');
		var content = document.createElement('div');
		var close = document.createElement('div');
		var overlay = document.createElement('div');
		var title = document.createElement('div');
		var p = document.createElement('p');

		//id and classes
		modal.className = "modal";
		content.className = "content";
		close.className = "close";
		overlay.className = "overlay";
		title.className = 'title';

		//text
		title.innerHTML = "Game Over!";
		p.innerHTML = "Your score is : " + this.gamePoints;

		//apending
		content.appendChild(title);
		content.appendChild(close);
		content.appendChild(p);
		modal.appendChild(content);
		modal.appendChild(overlay);

		this.field.appendChild(modal);

		//Modal events
		modal.style.display = "block";
			
		close.addEventListener('click', function(){
			modal.style.display = "none";
		});
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
