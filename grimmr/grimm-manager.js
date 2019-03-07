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
