//Grimm Reaper Core.


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
			var msgbox = new iBox(this.lastmessage, 800, 750, 1400, 300, "BlockInput"); //Requires clicking a button to proceed.
			this.listofobjects.push(msgbox);
			//Create a set of options.
			var boxcount = this.jsonchunks[this.index_i][this.index_j].parameters.length;
			for(var i = 0; i < boxcount; i++){
				//by default, they should have fixed width and height.
				var boxtext = this.jsonchunks[this.index_i][this.index_j].parameters[i];

				var box = new iBox(boxtext, 800 + TEXT_PADDING, 350 + i * 120, textWidth(boxtext) + TEXT_PADDING * 2, CHOICE_BOXHEIGHT, "Choices");
				if(this.jsonchunks[this.index_i][this.index_j].action){
					box.action = this.jsonchunks[this.index_i][this.index_j].action[i];
				}
				console.log(box.action);
				this.listofobjects.push(box);
			}

		}
		else if(this.jsonchunks[this.index_i][this.index_j].type == "Message"){
			var msgbox = new iBox(this.jsonchunks[this.index_i][this.index_j].parameters[0], 800, 750, MSG_BOXWIDTH, MSG_BOXHEIGHT, "Message");
			msgbox.sender = this.jsonchunks[this.index_i][this.index_j].sender;
			this.listofobjects.push(msgbox);
		}
		else{
			//Special Condition Resolver: Stage and Action Tags.
			var msgbox = new iBox("This part is not meant for display. If you manage to see this part, it means the code is running fine.", 800, 750, MSG_BOXWIDTH, MSG_BOXHEIGHT, "Generic");
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
			this.sender;
			this.x = x;
			this.y = y;
			this.width = width; //Use absolute width. We don't scale the window anyways.
			this.height = height;
			this.action;
			this.lifetime = 0;
			this.iscomplete = false;
		}

		calculateX(){
			return this.x - this.width/2 + TEXT_PADDING;
		}

		calculateY(){
			return this.y - this.height/2 + TEXT_PADDING;
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
				textAlign(LEFT);



				if(this.type == "Message" && this.iscomplete != true){
					if(this.lifetime > this.message.length){
						text(this.message, this.calculateX(), this.calculateY());
						this.iscomplete = true;
					}
					else{
						text(this.message.substring(0, this.lifetime), this.calculateX(), this.calculateY());
					}

				}
				else{
					text(this.message, this.calculateX(), this.calculateY());
					this.iscomplete = true;
				}

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
				textAlign(LEFT);
				text(this.message, this.calculateX(), this.calculateY());
			}

			if(this.sender){
				rectMode(CENTER);
				fill(239,31,149)
				strokeWeight(4);
				stroke(51,51,51);//Alligrater Pink, Subject to Change in Near Future.
				rect(this.x - this.width/2, this.y - this.height/2, textWidth(this.sender+30), 50);
				noStroke();
				fill(51,51,51);//Alligrater Pink
				textSize(18);
				textAlign(CENTER);

				text(this.sender, this.x - this.width/2, this.y - this.height/2);
			}
		}

		getType(){
			return this.type;
		}

		executeAction(){
			if(!this.iscomplete){
				this.iscomplete = true;
				return;
			}
			if(this.action){
				console.log("Action: " + this.action);
				//for now, we default this to next.
				GameManager.getInstance().next();
			}
			else{
				console.log("No Action Specified, Defaulting to Next()...");
				GameManager.getInstance().next();
			}
		}

		EventHandler(e){
			//Handles Event.
			if(e.getType() == "MouseMoveEvent"){
				this.isfocused = false;
				this.lifetime += 1;
				if(this.type == "Choices"){
					if(e.x > (this.x - this.width/2) && e.x < (this.x + this.width/2) && e.y > (this.y - this.height/2) && e.y < (this.y + this.height/2)){
						this.isfocused = true;
					}
				}
				if(this.type == "Message" || this.type == "Generic"){

				}
			}
			else if(e.getType() == "MouseClickEvent"){
				if(this.type != "BlockInput"){
					if(e.x > (this.x - this.width/2) && e.x < (this.x + this.width/2) && e.y > (this.y - this.height/2) && e.y < (this.y + this.height/2)){
						//Log the action to console.
						this.executeAction();

					}
				}

			}
		}

}
