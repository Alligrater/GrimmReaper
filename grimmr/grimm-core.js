//Grimm Reaper Core.


//This will be the collection of a set of messages.
//And will keep track what is on screen - i.e. characters, backdrop, current messageobject.

class TextBundle{

	constructor(){
		this.background;
		this.listofactors = [];
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

	draw(){
		/*

		*/
		for(var i = 0; i < this.listofobjects.length; i++){
			this.listofobjects[i].draw();
		}
	}

	getChunkData(i, j){
		return this.jsonchunks[i].content[j];
	}

	getChunkTag(tag){
		var inxi = 0;
		var canfind = false;
		for(var i = 0; i < this.jsonchunks.length; i++){
				if(this.jsonchunks[i].chunk == tag){
					canfind = true;
					inxi = i;
					break; //Finally a place I can use break.
			}
		}
		if(canfind){
			this.loadContent(inxi,0);
			console.log("Chunk located...relocating");
			return true;
		}
		else{
			console.log("Cannot find chunk with tag: " + tag);
			return false;
		}
	}

	getTag(tag){
		var inxi = 0;
		var inxj = 0;
		var canfind = false;
		for(var i = 0; i < this.jsonchunks.length; i++){
			for(var j = 0; j < this.jsonchunks[i].content.length; j++){
				if(this.getChunkData(i, j).tag && this.getChunkData(i, j).tag == tag){
					canfind = true;
					inxi = i;
					inxj = j;
					break; //Finally a place I can use break.
				}
			}
		}
		if(canfind){
			this.loadContent(inxi,inxj);
			console.log("content located...relocating");
			return true;
		}
		else{
			console.log("Cannot find content with tag: " + tag);
			return false;
		}
	}

	loadContent(i, j){
		if(this.getChunkData(i, j)){
			this.index_i = i;
			this.index_j = j;
			if(this.getChunkData(this.index_i, this.index_j).type == "Message"){
				this.lastmessage = this.getChunkData(this.index_i, this.index_j).parameters[0];
			}
			console.log(this.getChunkData(this.index_i, this.index_j).parameters[0])
		}
		else{
			console.log("Failed to locate content at " + i + ":" + j);
		}
		this.listofobjects = [];
		if(this.getChunkData(this.index_i, this.index_j).type == "Choices"){
			//Create iBox objects. subject to change and will be easy to change.
			var msgbox = new iBox(this.lastmessage, 800, 750, 1400, 300, "BlockInput"); //Requires clicking a button to proceed.
			this.listofobjects.push(msgbox);
			//Create a set of options.
			var boxcount = this.getChunkData(this.index_i, this.index_j).parameters.length;
			for(var i = 0; i < boxcount; i++){
				//by default, they should have fixed width and height.
				var boxtext = this.getChunkData(this.index_i, this.index_j).parameters[i];

				var box = new iBox(boxtext, 800 + TEXT_PADDING, 350 + i * 120, textWidth(boxtext) + TEXT_PADDING * 2, CHOICE_BOXHEIGHT, "Choices");
				if(this.getChunkData(this.index_i, this.index_j).action){
					box.action = this.getChunkData(this.index_i, this.index_j).action[i];
				}
				console.log(box.action);
				this.listofobjects.push(box);
			}

		}
		else if(this.getChunkData(this.index_i, this.index_j).type == "Message"){
			var msgbox = new iBox(this.getChunkData(this.index_i, this.index_j).parameters[0], 800, 750, MSG_BOXWIDTH, MSG_BOXHEIGHT, "Message");
			msgbox.sender = this.getChunkData(this.index_i, this.index_j).sender;
			if(this.getChunkData(this.index_i, this.index_j).action){
				msgbox.action = this.getChunkData(this.index_i, this.index_j).action[i]; //If it has an action
			}
			this.listofobjects.push(msgbox);
		}
		else if(this.getChunkData(this.index_i, this.index_j).type == "Action"){
			var actioncount = this.getChunkData(this.index_i, this.index_j).action.length; //How many actions are there?
			for(var i = 0; i < actioncount; i++){
				var actionbox = new iBox("", 800, 750, MSG_BOXWIDTH, MSG_BOXHEIGHT, "Message"); //No message will be displayed.
				if(this.getChunkData(this.index_i, this.index_j).action){
					actionbox.action = this.getChunkData(this.index_i, this.index_j).action[i]; //If it has an action
				}
				actionbox.iscomplete = true; //Is complete the moment it is created.
				actionbox.executeAction();//Directly runs the action and jump to the next scene.
				if(i == actioncount - 1){
					GameManager.getInstance().next();
				}
			}

		}
		else{
			//Special Condition Resolver: Stage and Action Tags.
			var msgbox = new iBox("This part is not meant for display. If you manage to see this part, it means the code is running fine.", 800, 750, MSG_BOXWIDTH, MSG_BOXHEIGHT, "Generic");
			this.listofobjects.push(msgbox);
		}
	}

	next(){
		//Clear the list of objects first.

		//Limitations on Grimm Composer: Message Will ALWAYS be a Length of 1 Array.
		this.loadContent(this.index_i, this.index_j+1);

	}

	showlog(){
		for(var x = 0; x < this.index_j; x++){
			if(this.getChunkData(this.index_i, x).type == "Message"){
				console.log(this.getChunkData(this.index_i, x).parameters[0])
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
					this.iscomplete = true;
					text(this.message, this.calculateX(), this.calculateY());
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
				if(this.action.startsWith("$tag")){
					//Go to place with the specific tag.
					var tagname = this.action.split(':')[1];
					if(!GameManager.getInstance().textbundle.getTag(tagname)){
						GameManager.getInstance().next();
					}
				}
				else if(this.action.startsWith("$chunk")){
					var tagname = this.action.split(':')[1];
					if(!GameManager.getInstance().textbundle.getChunkTag(tagname)){
							GameManager.getInstance().next();
					}
				}
				else if(this.action.startsWith("$clearactor")){
					//Remove all actors on the stage.
					GameManager.getInstance().textbundle.listofactors = [];
					//Removes all actors.
				}
				else if(this.action.startsWith("$replaceactor")){
					//Replaces the actor with another one.
					//$replaceactor:goldenk:grimmr
				}
				else if(this.action.startsWith("$removeactor")){
					//Remove actor with the name 
					//$removeactor:goldenk
				}
				else if(this.action.startsWith("$actor")){
					//Create actors for the stage. It should have 3 parameters.
				}
				else if(this.action.startsWith("$stage") || this.action.startsWith("$background")){
					//Create a background for the stage
					//This overrides the previous stage by clearing it.
				}
				else{
					//Not valid action, use default.
					console.log("No Action Specified, Defaulting to Next()...");
					GameManager.getInstance().next();
				}

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
