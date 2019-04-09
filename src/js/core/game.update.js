/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */
function gameUpdate ( scope ) {
    return function update( tFrame ) {
        let state = scope.state || {};

        // If there are entities, iterate through them and call their `update` methods
        if (state.hasOwnProperty('entities')) {
            let entities = scope.state.entities;
            // Loop through entities
            for (let entity in entities) {
                // Fire off each active entities `render` method
                entities[entity].update();
            }
        }

        // Collisions

        if (state.hasOwnProperty('collisions')) {
            let collisions = scope.state.collisions;
            // Loop through entities
            for (let collision in collisions) {
                // Fire off each active entities `render` method
                collisions[collision].update();
            }
        }

        return state;
    }   
}

module.exports = gameUpdate;