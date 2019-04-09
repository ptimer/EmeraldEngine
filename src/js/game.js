    // Modules
var gameLoop = require('./core/game.loop.js'),
    gameUpdate = require('./core/game.update.js'),
    gameRender = require('./core/game.render.js'),
    // Entities
    playerEnt = require('./players/player.js'),

    //StaticObjects
    blockStat = require('./static/block.js'),

    // Utilities
    cUtils = require('./utils/utils.canvas.js'), // require our canvas utils
    $container = document.getElementById('container');

function Game(w, h, targetFps, showFps) {
    var that;

    // Setup some constants
    this.constants = {
        width: w,
        height: h,
        targetFps: targetFps,
        showFps: showFps
    };

    // Instantiate an empty state object
    this.state = {};

  // Generate a canvas and store it as our viewport
    this.viewport = cUtils.generateCanvas(w, h);
    this.viewport.id = "gameViewport";

    // Get and store the canvas context as a global
    this.context = this.viewport.getContext('2d');

    // Append viewport into our container within the dom
    $container.insertBefore(this.viewport, $container.firstChild);

    // Instantiate core modules with the current scope
    this.update = gameUpdate( this );
    this.render = gameRender( this );
    this.loop = gameLoop( this );

    that = this;

    var createEntities = function createEntities() {
        that.state.entities = that.state.entities || {};
        that.state.entities.player = new playerEnt(that, (w / 2), (h - 100));
    }();

    var createStaticObjects = function createStaticObjects(){
        that.state.staticObjects = that.state.staticObjects || {};
        that.state.staticObjects.blockStat = new blockStat(that, 0, (h - 40), 20, w);
    }();

    return this;
}

// Instantiate a new game in the global scope at 800px by 600px
window.game = new Game(800, 600, 60, true);

module.exports = game;