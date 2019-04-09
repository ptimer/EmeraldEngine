// Utilities
    cUtils = require('../utils/utils.canvas.js'), // require our canvas utils
    $container = document.getElementById('container');

EngineSettings = {
	
	initializeGame: function(scope, canvasSettings){

		scope.state = {}

		scope.viewport = cUtils.generateCanvas(canvasSettings.canvasWidth, canvasSettings.canvasHeight);
	    scope.viewport.id = "gameViewport";

	    scope.context = scope.viewport.getContext('2d');

	    $container.insertBefore(scope.viewport, $container.firstChild);
	}
	
}

module.exports = EngineSettings;