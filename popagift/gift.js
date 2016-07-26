var Box = function(position){
	this.domObj = null;
	this.points = null;
	this.dead = false;

	var _this = this;
	//create a box
	var ctr = document.createElement('div');
	ctr.className = 'ctr';
	ctr.setAttribute('points', 0);
	var addPoints = document.createElement('span');
	var gift = Math.floor(Math.random() * 3  + 1 );
	ctr.style.background = "url('img/gift" + gift + ".png') no-repeat";
	//pop a box event
	ctr.addEventListener('click', function(){
		if(!(_this.dead)){
			
			_this.domObj.className += ' dead';
			_this.dead = true;
			//hide dead box
			document.dispatchEvent(new CustomEvent('pop', {'detail' : {myPoints : _this.points ,ctr : _this.domObj}}));
		}
	});

	//reset box
	ctr.addEventListener('animationend', function(){
		_this.dead = false;
		_this.domObj.offsetWidth = _this.domObj.offsetWidth;
		_this.domObj.className = 'ctr';
	});

	ctr.appendChild(addPoints);
	this.domObj = ctr;
	this.setBoxPos(position);
}

Box.prototype = {
	getDomObj : function(){
		return this.domObj;
	},

	setBoxPos : function(position){
		this.domObj.style.left = position + "px";
	},

	setBoxAction : function(obj){
		if(this.domObj.className=='ctr'){
			this.domObj.className = obj.t;
			this.points = obj.p;
		}
	}
};

