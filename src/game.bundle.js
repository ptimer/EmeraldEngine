(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function collision(){
	var A;
	var B;
	var message;

	this.detect = function(obj1, obj2, message){
		this.A = obj1;
		this.B = obj2;
		this.message = message;
	}

	this.update = function(){

		if (
		    this.A.position.x < this.B.position.x + this.B.size.width &&
		    this.A.position.x + this.A.size.width > this.B.position.x &&
		    this.A.position.y < this.B.position.y + this.B.size.height &&
		    this.A.position.y + this.A.size.height > this.B.position.y
		  ) {
		    console.log(this.message);
		  }
	}

	this.getDistance = function(x1, y1, x2, y2){
		let xDistance = x2 - x1;
		let yDistance = y2 - y1;

		return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
	}
}

module.exports = collision;
},{}],2:[function(require,module,exports){
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
},{"../utils/utils.canvas.js":10}],3:[function(require,module,exports){
/** Game Loop Module
 * This module contains the game loop, which handles
 * updating the game state and re-rendering the canvas
 * (using the updated state) at the configured FPS.
 */
function gameLoop ( scope ) {
    var loop = this;

    // Initialize timer variables so we can calculate FPS
    var fps = scope.constants.targetFps,
        fpsInterval = 1000 / fps,
        before = window.performance.now(),
        // Set up an object to contain our alternating FPS calculations
        cycles = {
            new: {
                frameCount: 0,
                startTime: before,
                sinceStart: 0
            },
            old: {
                frameCount: 0,
                startTime: before,
                sineStart: 0
            }
        },
        // Alternating Frame Rate vars
        resetInterval = 5,
        resetState = 'new';

    loop.fps = 0;

    // Main game rendering loop
    loop.main = function mainLoop( tframe ) {
        // Request a new Animation Frame
        // setting to `stopLoop` so animation can be stopped via
        // `window.cancelAnimationFrame( loop.stopLoop )`
        loop.stopLoop = window.requestAnimationFrame( loop.main );

        // How long ago since last loop?
        var now = tframe,
            elapsed = now - before,
            activeCycle, targetResetInterval;

        // If it's been at least our desired interval, render
        if (elapsed > fpsInterval) {
            // Set before = now for next frame, also adjust for 
            // specified fpsInterval not being a multiple of rAF's interval (16.7ms)
            // ( http://stackoverflow.com/a/19772220 )
            before = now - (elapsed % fpsInterval);

            // Increment the vals for both the active and the alternate FPS calculations
            for (var calc in cycles) {
                ++cycles[calc].frameCount;
                cycles[calc].sinceStart = now - cycles[calc].startTime;
            }

            // Choose the correct FPS calculation, then update the exposed fps value
            activeCycle = cycles[resetState];
            loop.fps = Math.round(1000 / (activeCycle.sinceStart / activeCycle.frameCount) * 100) / 100;

            // If our frame counts are equal....
            targetResetInterval = (cycles.new.frameCount === cycles.old.frameCount 
                                   ? resetInterval * fps // Wait our interval
                                   : (resetInterval * 2) * fps); // Wait double our interval

            // If the active calculation goes over our specified interval,
            // reset it to 0 and flag our alternate calculation to be active
            // for the next series of animations.
            if (activeCycle.frameCount > targetResetInterval) {
                cycles[resetState].frameCount = 0;
                cycles[resetState].startTime = now;
                cycles[resetState].sinceStart = 0;

                resetState = (resetState === 'new' ? 'old' : 'new');
            }

            // Update the game state
            scope.state = scope.update( now );
            // Render the next frame
            scope.render();
        }
    };

    // Start off main loop
    loop.main();

    return loop;
}

module.exports = gameLoop;
},{}],4:[function(require,module,exports){
/** Game Render Module
 * Called by the game loop, this module will
 * perform use the global state to re-render
 * the canvas using new data. Additionally,
 * it will call all game entities `render`
 * methods.
 */
function gameRender( scope ) {
    // Setup globals
    let w = scope.constants.width,
        h = scope.constants.height;

    return function render() {
        // Clear out the canvas
        scope.context.clearRect(0, 0, w, h);

        // If there are entities, iterate through them and call their `render` methods
        if (scope.state.hasOwnProperty('entities')) {
            let entities = scope.state.entities;
            // Loop through entities
            for (let entity in entities) {
                // Fire off each active entities `render` method
                entities[entity].render();
            }
        }
    }
}

module.exports = gameRender;
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
// Modules
let modules = {
    gameLoop: require('./core/game.loop.js'),
    EngineSettings: require('./core/game.engineSettings.js'),
    gameUpdate: require('./core/game.update.js'),
    gameRender: require('./core/game.render.js'),
    collision: require('./core/game.collision.js')
}

// Entities
let entities = {
    playerEnt: require('./gameObjects/players/player.js')
}
//StaticObjects
let StaticObjects = {
    blockStat: require('./gameObjects/static/block.js')
}

let ui = {
    titleAndFps: require('./gameObjects/ui/titleAndFps.js')
}


function EmeraldEngine(w, h, targetFps, showFps) {
    var $this = this;

    // Setup some constants
    this.constants = {
        width: w,
        height: h,
        targetFps: targetFps,
        showFps: showFps
    };

    modules.EngineSettings.initializeGame(this, {canvasWidth: w, canvasHeight: h});
    

    // Instantiate core modules with the current scope
    this.update = modules.gameUpdate( this );
    this.render = modules.gameRender( this );
    this.loop = modules.gameLoop( this );


    // |- Game Logic

    var createEntities = function() {
        $this.state.entities = $this.state.entities || {};

        $this.state.entities.player = new entities.playerEnt($this, (w / 2), (h - 100), 16, 23);
    }();

    var createStaticObjects = function(){

        $this.state.entities.blockStat = new StaticObjects.blockStat($this, 0, (h - 40), w, 20);
        $this.state.entities.blockStat2 = new StaticObjects.blockStat($this, 300, (h - 200), 50, 50);
    }();

    var createUi = function(){
        $this.state.entities.titleAndFps = new ui.titleAndFps($this);
    }();


    var createCollisions = function(){
       $this.state.collisions = $this.state.collisions || {};

       $this.state.collisions.mouseAndBlock = new modules.collision();
       $this.state.collisions.mouseAndBlock.detect($this.state.entities.player.state, $this.state.entities.blockStat.state, "block 1");


       $this.state.collisions.mouseAndBlock2 = new modules.collision();
       $this.state.collisions.mouseAndBlock2.detect($this.state.entities.player.state, $this.state.entities.blockStat2.state, "block 2");
    }();

    // Game Logic -|

    return this;
}

// Instantiate a new game in the global scope at 800px by 600px
window.game = new EmeraldEngine(800, 600, 60, true);

module.exports = game;
},{"./core/game.collision.js":1,"./core/game.engineSettings.js":2,"./core/game.loop.js":3,"./core/game.render.js":4,"./core/game.update.js":5,"./gameObjects/players/player.js":7,"./gameObjects/static/block.js":8,"./gameObjects/ui/titleAndFps.js":9}],7:[function(require,module,exports){
let keys = require('../../utils/utils.keysDown.js'),
    mathHelpers = require('../../utils/utils.math.js');

/** Player Module
 * Main player entity module.
 */
function Player(scope, x, y, w, h) {
    let player = this;

    // Create the initial state
    player.state = {
        position: {
            x: x,
            y: y
        },
        size: {
            width: w,
            height: h
        },
        moveSpeed: 5
    };

    // Set up any other constants
    let height = h,
        width = w;

    // Draw the player on the canvas
    player.render = function playerRender() {
        scope.context.fillStyle = '#40d870';
        scope.context.fillRect(
            player.state.position.x,
            player.state.position.y,
            width, height
        );
    };

    // Fired via the global update method.
    // Mutates state as needed for proper rendering next state
    player.update = function playerUpdate() {
        // Check if keys are pressed, if so, update the players position.
        if (keys.isPressed.left) {
            player.state.position.x -= player.state.moveSpeed;
        }

        if (keys.isPressed.right) {
            player.state.position.x += player.state.moveSpeed;
        }

        if (keys.isPressed.up) {
            player.state.position.y -= player.state.moveSpeed;
        }

        if (keys.isPressed.down) {
            player.state.position.y += player.state.moveSpeed;
        }

        // Bind the player to the boundary
        player.state.position.x = player.state.position.x.boundary(0, (scope.constants.width - width));
        player.state.position.y = player.state.position.y.boundary(0, (scope.constants.height - height));
    };

    return player;
}

module.exports = Player;
},{"../../utils/utils.keysDown.js":11,"../../utils/utils.math.js":12}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
module.exports = {
    /** Determine the proper pixel ratio for the canvas */
    getPixelRatio : function getPixelRatio(context) {
      console.log('Determining pixel ratio.');
      var backingStores = [
        'webkitBackingStorePixelRatio',
        'mozBackingStorePixelRatio',
        'msBackingStorePixelRatio',
        'oBackingStorePixelRatio',
        'backingStorePixelRatio'
      ];

      var deviceRatio = window.devicePixelRatio;

      // Iterate through our backing store props and determine the proper backing ratio.
      var backingRatio = backingStores.reduce(function(prev, curr) {
        return (context.hasOwnProperty(curr) ? context[curr] : 1);
      });

      // Return the proper pixel ratio by dividing the device ratio by the backing ratio
      return deviceRatio / backingRatio;
    },

    /** Generate a canvas with the proper width / height
     * Based on: http://www.html5rocks.com/en/tutorials/canvas/hidpi/
     */
    generateCanvas : function generateCanvas(w, h) {
      console.log('Generating canvas.');

      var canvas = document.createElement('canvas'),
          context = canvas.getContext('2d');
      // Pass our canvas' context to our getPixelRatio method
      var ratio = this.getPixelRatio(context);

      // Set the canvas' width then downscale via CSS
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      canvas.style.width = w +'px';
      canvas.style.height = h +'px';
      // Scale the context so we get accurate pixel density
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      return canvas;
    }
};
},{}],11:[function(require,module,exports){
/** keysDown Utility Module
 * Monitors and determines whether a key 
 * is pressed down at any given moment.
 * Returns getters for each key.
 */
function keysDown() {
    this.isPressed = {};

    var left, right, up, down;

    // Set up `onkeydown` event handler.
    document.onkeydown = function (ev) {
        if (ev.keyCode === 39) { right = true; }
        if (ev.keyCode === 37) { left = true; }
        if (ev.keyCode === 38) { up = true; }
        if (ev.keyCode === 40) { down = true; }
    };

    // Set up `onkeyup` event handler.
    document.onkeyup = function (ev) {
        if (ev.keyCode === 39) { right = false; }
        if (ev.keyCode === 37) { left = false; }
        if (ev.keyCode === 38) { up = false; }
        if (ev.keyCode === 40) { down = false; }
    };

    // Define getters for each key
    // * Not strictly necessary. Could just return
    // * an object literal of methods, the syntactic
    // * sugar of `defineProperty` is just so much sweeter :)
    Object.defineProperty(this.isPressed, 'left', {
        get: function() { return left; },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this.isPressed, 'right', {
        get: function() { return right; },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this.isPressed, 'up', {
        get: function() { return up; },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this.isPressed, 'down', {
        get: function() { return down; },
        configurable: true,
        enumerable: true
    });

    return this;
}

module.exports = keysDown();
},{}],12:[function(require,module,exports){
/** 
 * Number.prototype.boundary
 * Binds a number between a minimum and a maximum amount.
 * var x = 12 * 3;
 * var y = x.boundary(3, 23);
 * y === 23
 */

var Boundary = function numberBoundary(min, max) {
    return Math.min( Math.max(this, min), max );
};

// Expose methods
Number.prototype.boundary = Boundary;
module.exports = Boundary;
},{}]},{},[6]);
