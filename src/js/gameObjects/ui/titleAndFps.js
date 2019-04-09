function titleAndFps(scope) {
    var titleAndFps = this;

    // Draw the player on the canvas
    titleAndFps.render = function() {
         // Spit out some text
        scope.context.font = '32px Arial';
        scope.context.fillStyle = '#fff';
        scope.context.fillText('It\'s dangerous to travel this route alone.', 5, 50);

        // If we want to show the FPS, then render it in the top right corner.
        if (scope.constants.showFps) {
            scope.context.fillStyle = '#ff0';
            scope.context.fillText(scope.loop.fps, scope.constants.width - 100, 50);
        }
    };

    // Fired via the global update method.
    // Mutates state as needed for proper rendering next state
    titleAndFps.update = function() {
        
    };

    return titleAndFps;
}

module.exports = titleAndFps;