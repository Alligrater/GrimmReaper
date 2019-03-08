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
						if(items[i].includes(".")){//Is an image, not a path.){
							var img = loadImage(relativepath + items[i]);
							var gr = new GrImage(relativepath + items[i], img, items[i].substring(0, items[i].indexOf(".")));
							console.log(gr);
							imageList.push(gr);//This way it generates a useable name.
						}

					}
				});
			}
			//Should load all image resources from the file.
			loadImages();//This outputs whatever's under the folder for now.
		return {
			//Public Fields
			getImageList(){
				return imageList;
			},
			getGrImageFromName(name){
				for(var i = 0; i < imageList.length; i ++){
					if(imageList[i].name == name){
						console.log("Found GI with name: " + name);
						return imageList[i];
					}
				}
				return null;
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
