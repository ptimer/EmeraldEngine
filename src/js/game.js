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