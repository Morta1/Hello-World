var Pika = function(posObj){
	this.domObj = null;
	this.actionObj = null;
	this.dead = false;
	this.points = null;
	var _this = this;

	var ctr = document.createElement('div');
	var pika = document.createElement('div');
	var div = document.createElement('div');
	var hole = document.createElement('div');
	
	ctr.className = "ctr";
	pika.className = "pika";
	hole.className = "hole";

	div.addEventListener('click', function(){
		if(!(_this.dead)){
			_this.actionObj.className += " dead";
			_this.dead = true;
			document.dispatchEvent(new CustomEvent('whack', {'detail' : _this.points}));
		}		
	});

	div.addEventListener('webkitAnimationEnd', function(){
		_this.dead = false;
		_this.actionObj.offsetWidth = _this.actionObj.offsetWidth;
		_this.actionObj.className = '';
	});

	ctr.appendChild(hole);
	pika.appendChild(div);
	ctr.appendChild(pika);

	this.domObj = ctr;
	this.actionObj = div;
	this.setPikaPos(posObj);
};

Pika.prototype = {
	getDomObj : function(){
		return this.domObj;
	},

	setPikaPos : function(posObj){
		this.domObj.style.left = posObj.x + "px";
		this.domObj.style.top = posObj.y + "px";
	},

	setPikaAction : function(obj){
		if(this.actionObj.className==''){
			this.actionObj.className = obj.t;
			this.points = obj.p;
		}
	}
};

