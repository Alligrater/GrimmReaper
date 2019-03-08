//This keep track of models. AKA resource type objects

//This is the class that controls objects displayed on the viewport.
class StageActor{
	constructor(grimage, actorname, x, y){
		this.grimage = grimage;
		this.x = x;
		this.y = y;
		this.actorname = actorname;
	}

	draw(){
		//literally just draw something.
		//Always use center mode.
		//It is drawing, but somehow not shown on the screen.
		imageMode(CENTER);
		image(this.grimage.img, this.x, this.y);
		//image(this.grimage.img, this.x, this.y);
	}

	getName(){
		return this.actorname;
	}

	changeImage(newgi){
		this.grimage = newgi;
	}

}

class GrImage{
	constructor(path, img, name){
		this.path = path;
		this.img = img;
		this.name = name;
	}
}
