/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */
function gameUpdate ( scope ) {
    return function update( tFrame ) {
        var state = scope.state || {};

        if(scope.state.hasOwnProperty('staticObjects')){
            var staticObjects = scope.state.staticObjects;

            for(var obj in staticObjects){
                staticObjects[obj].update();
            }
        }

        // If there are entities, iterate through them and call their `update` methods
        if (state.hasOwnProperty('entities')) {
            var entities = scope.state.entities;
            // Loop through entities
            for (var entity in entities) {
                // Fire off each active entities `render` method
                entities[entity].update();
            }
        }

        return state;
    }   
}

module.exports = gameUpdate;