window.onload = function() {
	/*	 var classes = new Array(
	 "Game",
	 "Collision",
	 "Animation",
	 "Physic",
	 "Sprite"
	 );

	 for(var i=0,j=classes.length; i<j; ++i) {
	 document.write( "<script type='text/javascript' src='" + classes[i] + ".js'></script>" );
	 }*/
	var game = new Game("__canvas", "__log");

	game.initialize();
	game.getCanvas().addEventListener('mousemove', function(e) {
		game.onMouseMove(e);
	});
	game.animation.showFps(10);
	// comment to hide fps display
	game.animation.setStage(function() {
		game.pipeline();
	});
	game.animation.start(20);
};
