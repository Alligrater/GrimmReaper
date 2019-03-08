//This needs to switch to singleton now.
var GameManager = (function(){
	var instance;
	function init(){
		//Private Fields.
		var textbundle = new TextBundle();
		var documentWidth = window.innerWidth;
		var documentHeight = window.innerHeight;
		createCanvas(documentWidth, documentHeight);


		return {
		//Public Fields
			update(){
				background(51);
				this.textbundle.draw();
			},
			next(){
				this.textbundle.next();
			},
			setJson(jsonobject){
				if(!this.textbundle){
					this.textbundle = new TextBundle();
				}
				this.textbundle.setJson(jsonobject);
			},
			notifyAll(e){
				//Get all objects currently in the text bundle, then notify them about the event.
				for(var i = 0; i < this.textbundle.listofobjects.length; i++){
					this.textbundle.listofobjects[i].EventHandler(e);
				}
			}
		}
	}

	return {
		//获取singleton的实例，如果存在就返回，不存在创建新的实例
		getInstance: function () {
			if (!instance) {
				instance= init();
			}
			return instance;
		}
	};
})();

var ResourceManager = (function(){
	var instance;
	function init(){
			//Private Fields.
			var imageList = [];
			function loadImages(){
				var fs = require('fs');
				var path = './www/res/image/'; //actual path for readdir to work
				var relativepath = './res/image/' //actual path for p5 to work
				fs.readdir(path, function(err, items) {
					for (var i=0; i<items.length; i++) {
						console.log(items[i]);
						if(items[i].includes(".")){//Is an image, not a path.){
							imageList.push(new GrImage(relativepath + items[i], items[i].substring(0, items[i].indexOf("."))));//This way it generates a useable name.
						}
		
					}
				});
				
				for(var i = 0; i < imageList.length; i++){
					console.log("Image: " + imageList[i].name);//this should work fine.
				}
			}
			//Should load all image resources from the file.
			loadImages();//This outputs whatever's under the folder for now.
		return {
			//Public Fields
			getImageList(){
				return imageList;
			}

		}
	}


	return {
		//获取singleton的实例，如果存在就返回，不存在创建新的实例
		getInstance: function () {
			if (!instance) {
				instance= init();
			}
			return instance;
		}
	};
})();