//This keep track of models. AKA resource type objects

//This is the class that controls objects displayed on the viewport.
class ViewportObject{
	constructor(gi, x, y){
		this.gi = gi;
		this.x = x;
		this.y = y;
		this.width = gi.width;
		this.height = gi.height;
	}
	
	draw(){
		//literally just draw something.
		//Always use center mode.
		image(this.gi, this.x - this.width/2, this.y - this.height / 2,);
	}
	
	changeImage(newgi){
		this.gi = newgi;
		this.width = newgi.width;
		this.height = newgi.height;
	}
	
}

class GrImage{
	constructor(path, name){
		this.path = path;
		this.img = loadImage(path);
		this.name = name;
	}

}