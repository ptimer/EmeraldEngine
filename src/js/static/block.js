var keys = require('../utils/utils.keysDown.js'),
    mathHelpers = require('../utils/utils.math.js');

/** Player Module
 * Main player entity module.
 */
function block(scope, x, y, w, h) {
    var block = this;

    // Create the initial state
    block.state = {
        position: {
            x: x,
            y: y
        }
    };

    // Set up any other constants
    var height = w,
        width = h;

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