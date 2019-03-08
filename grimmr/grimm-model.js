//This keep track of models. AKA resource type objects

//This is the class that controls objects displayed on the viewport.
class StageActor{
	constructor(grimage, actorname, x, y){
		this.grimage = grimage;
		this.x = x;
		this.y = y;
		this.width = grimage.width;
		this.height = grimage.height;
		this.actorname = actorname;
	}

	draw(){
		//literally just draw something.
		//Always use center mode.
		//It is drawing, but somehow not shown on the screen.
		//image(this.grimage.img, this.x - this.width/2, this.y - this.height / 2);
			image(this.grimage.img, this.x, this.y);
	}

	getName(){
		return this.actorname;
	}

	changeImage(newgi){
		this.grimage = newgi;
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
