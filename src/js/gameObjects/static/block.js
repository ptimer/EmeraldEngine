function block(scope, x, y, w, h) {
    let block = this;

    // Create the initial state
    block.state = {
        position: {
            x: x,
            y: y
        },
        size: {
            height: h,
            width: w
        }
    };

    // Set up any other constants
    let height = h,
        width = w;

    // Draw the player on the canvas
    block.render = function blockRender() {
        scope.context.fillStyle = 'white';
        scope.context.fillRect(
            block.state.position.x,
            block.state.position.y,
            width, height
        );
    };

    // Fired via the global update method.
    // Mutates state as needed for proper rendering next state
    block.update = function blockUpdate() {
        
    };

    return block;
}

module.exports = block;