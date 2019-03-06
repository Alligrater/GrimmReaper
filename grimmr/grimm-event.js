
class Event{
	type;
	constructor(){
		this.type = "GenericEvent";
	}
  
	getType(){
		return this.type;
	}
}

class MouseEvent extends Event{
	x;
	y;
	constructor(x, y){
		super();//Well, there's nothing to super...
		this.x = x;
		this.y = y;
		this.type = "GenericMouseEvent";
	}
}

class MouseMoveEvent extends MouseEvent{
	
	constructor(x, y){
		super(x, y);
		this.type = "MouseMoveEvent";
		
	}
}

class MouseClickEvent extends MouseEvent{
	//clicked: LEFT only, right and middle seem to have other way of calling.
	constructor(x, y){
		super(x, y);
		this.type = "MouseClickEvent";
	}
}
