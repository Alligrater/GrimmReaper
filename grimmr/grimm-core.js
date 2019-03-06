//Grimm Reaper Core.

class Game{
	constructor(){
		//Create a black canvas on the screen for now.
		var textbundle = new TextBundle();
		var documentWidth = window.innerWidth;
		var documentHeight = window.innerHeight;
		createCanvas(documentWidth, documentHeight);
	}
	
	update(){
		background(51);

		this.textbundle.draw();
	}
	
	next(){
		this.textbundle.next();
		//clear the list of game objects.
	}
	
	setJson(jsonobject){
		if(!this.textbundle){
			this.textbundle = new TextBundle();
		}
		this.textbundle.setJson(jsonobject);
	}
	
	notifyAll(e){
		//Get all objects currently in the text bundle, then notify them about the event.
		for(var i = 0; i < this.textbundle.listofobjects.length; i++){
			this.textbundle.listofobjects[i].EventHandler(e);
		}
	}

}

//This will be the collection of a set of messages.
//And will keep track what is on screen - i.e. characters, backdrop, current messageobject.

class TextBundle{
	
	constructor(){
		this.listofobjects = [];
		this.lastmessage = "";
		this.index_i = 0;
		this.index_j = -1;
		if(!this.jsonchunks){
			console.log("Waiting for chunk data input.")
		}
		
	}
	
	setJson(jsonobject){
		this.index_i = 0;
		this.index_j = -1;
		this.jsonobject = jsonobject;
		this.jsonchunks = jsonobject.jsonchunks;
		this.next();
	}
	
	//I don't even know why we need this.
	getJson(){
		return this.jsonobject;
	}
	
	getCurrentType(){
		return this.jsonchunks[this.index_i][this.index_j].type;
	}
	
	draw(){
		/*
		
		*/
		for(var i = 0; i < this.listofobjects.length; i++){
			this.listofobjects[i].draw();
		}
	}
	
	next(){
		//Clear the list of objects first.
		
		
		//Limitations on Grimm Composer: Message Will ALWAYS be a Length of 1 Array.
		if(this.jsonchunks[this.index_i][this.index_j+1]){
			this.index_j += 1;
			if(this.jsonchunks[this.index_i][this.index_j].type == "Message"){
				this.lastmessage = this.jsonchunks[this.index_i][this.index_j].parameters[0];
			}
			console.log(this.jsonchunks[this.index_i][this.index_j].parameters[0])
		}
		else{
			console.log("you are at the end of the plot.")
		}
		
		this.listofobjects = [];
		//Determine what to do with each type of objects: message, choices, textbox.
		if(this.jsonchunks[this.index_i][this.index_j].type == "Choices"){
			//Create iBox objects. subject to change and will be easy to change.
			var msgbox = new iBox(this.lastmessage, 800, 750, 1400, 300, "Generic");
			this.listofobjects.push(msgbox);
			var boxcount = this.jsonchunks[this.index_i][this.index_j].parameters.length;
			for(var i = 0; i < boxcount; i++){
				//by default, they should have fixed width and height.
				var bw = 1200;
				var bh = 100;
				var box = new iBox(this.jsonchunks[this.index_i][this.index_j].parameters[i], 800, 350 + i * 120, bw, bh, "Choices");
				box.action = this.jsonchunks[this.index_i][this.index_j].action[i];
				console.log(box.action);
				this.listofobjects.push(box);
			}
			
		}
		else if(this.jsonchunks[this.index_i][this.index_j].type == "Message"){
			var msgbox = new iBox(this.jsonchunks[this.index_i][this.index_j].parameters[0], 800, 750, 1400, 300, "Generic");
			this.listofobjects.push(msgbox);
		}
		else{
			var msgbox = new iBox("This part is not meant for display. If you manage to see this part, it means the code is running fine.", 800, 750, 1400, 300, "Generic");
			this.listofobjects.push(msgbox);
		}
	}
	
	showlog(){
		for(var x = 0; x < this.index_j; x++){
			if(this.jsonchunks[this.index_i][x].type == "Message"){
				console.log(this.jsonchunks[this.index_i][x].parameters[0])
			}
		}
	}
	
	
}

//Interactive Box.
class iBox{
		constructor(message, x, y, width, height, type){
			this.isfocused = false;
			this.type = type;
			this.message = message;
			this.x = x;
			this.y = y;
			this.width = width; //Use absolute width. We don't scale the window anyways.
			this.height = height;
			this.action;
		}
		
		setAction(action){
			this.action = action;
		}
		
		getAction(){
			return this.action;
		}
		
		draw(){
			if(this.isfocused == false){
				//First, draw a box behind it. We use the center as position.
				rectMode(CENTER);
				fill('rgba(51,51,51,60)')
				strokeWeight(4);
				stroke(239,31,149);//Alligrater Pink, Subject to Change in Near Future.
				rect(this.x, this.y, this.width, this.height);
				
				noStroke();
				fill(239,31,149);//Alligrater Pink
				textSize(18);
				textAlign(CENTER);
				text(this.message, this.x, this.y);
			}
			else{
				//First, draw a box behind it. We use the center as position.
				rectMode(CENTER);
				fill(239,31,149)
				strokeWeight(4);
				stroke(51,51,51);//Alligrater Pink, Subject to Change in Near Future.
				rect(this.x, this.y, this.width, this.height);
				
				noStroke();
				fill(51,51,51);//Alligrater Pink
				textSize(18);
				textAlign(CENTER);
				text(this.message, this.x, this.y);			
				
			}

		}
		
		getType(){
			return this.type;
		}
		
		EventHandler(e){
			//Handles Event.
			this.isfocused = false;
			if(this.type == "Choices" && e.getType() == "MouseMoveEvent"){
				if(e.x > (this.x - this.width/2) && e.x < (this.x + this.width/2) && e.y > (this.y - this.height/2) && e.y < (this.y + this.height/2)){
					this.isfocused = true;
				}
			}
			else if(this.type == "Choices" && e.getType() == "MouseClickEvent"){
				if(e.x > (this.x - this.width/2) && e.x < (this.x + this.width/2) && e.y > (this.y - this.height/2) && e.y < (this.y + this.height/2)){
					//Log the action to console.
					if(this.action){
						console.log(this.action)
					}
					else{
						console.log("No action specified.")
					}
				}
			}
		}

}
