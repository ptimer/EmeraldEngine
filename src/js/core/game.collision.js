function collision(){
	var A;
	var B;
	var message;

	this.detect = function(obj1, obj2, message){
		this.A = obj1;
		this.B = obj2;
		this.message = message;
	}

	this.update = function(){

		if (
		    this.A.position.x < this.B.position.x + this.B.size.width &&
		    this.A.position.x + this.A.size.width > this.B.position.x &&
		    this.A.position.y < this.B.position.y + this.B.size.height &&
		    this.A.position.y + this.A.size.height > this.B.position.y
		  ) {
		    console.log(this.message);
		  }
	}

	this.getDistance = function(x1, y1, x2, y2){
		let xDistance = x2 - x1;
		let yDistance = y2 - y1;

		return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
	}
}

module.exports = collision;