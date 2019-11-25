let game;
let phaser;
let world;

let input;
let ui;
let audio;

let time;
///

var map;
var player;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;
var backgroundBg;
var backgroundFar;
var backgroundMid;
var backgroundFront;

function main() {
    console.log("main()");

    var config = {
        type: Phaser.AUTO,
        parent: 'my-game',
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 1000 },
                debug: true
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    phaser = new Phaser.Game(config);
}

/**
 * The first thing to be called.
 * Loads assets.
 */
function preload() {
    console.log("preload()");

    game = this;
    game.score = 0;

    this.load.image('background_img', 'assets/gameBg.png');
    this.load.image('bullet_img', 'assets/bullet.png');
    this.load.audio('intro', 'assets/audio/start.mp3');
    this.load.audio('bg', 'assets/audio/start.mp3');
    //this.load.audio('bg', 'assets/audio/ufo_Theme.mp3');
    this.load.audio('explode', 'assets/audio/explode.mp3');
    this.load.audio('fly', 'assets/audio/fly.mp3');
    this.load.audio('shoot', 'assets/audio/shoot.mp3');
    ///

    // map made with Tiled in JSON format
    /// this.load.tilemapTiledJSON('map', 'assets/map.json');
    // tiles in spritesheet 
    // this.load.spritesheet('tiles', 'assets/tiles.png', { frameWidth: 70, frameHeight: 70 });
    // simple coin image
    this.load.image('coin', 'assets/coinGold.png');
    // player animations
    this.load.atlas('player', 'assets/player.png', 'assets/player.json');

    // rifle image
    this.load.image('rifle', 'assets/rifle.png');
    this.load.image('pistol', 'assets/pistol.png');
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/level01.json');
    // tiles in spritesheet 
    this.load.spritesheet('tiles', 'assets/industrial_tiles.png', { frameWidth: 70, frameHeight: 70 });
    this.load.image('spike', 'assets/spike.png');

    this.load.image('background_bg', 'assets/backgrounds/level1/bg.png');
    this.load.image('background_front', 'assets/backgrounds/level1/foreground.png');
    this.load.image('background_mid', 'assets/backgrounds/level1/mid.png');
    this.load.image('background_back', 'assets/backgrounds/level1/far.png');
}

/**
 * Initialize the game.
 * The assets have been loaded by this point.
 */
function create() {
    console.log("create()");

    /*this.backgroundBg = game.add.tileSprite(0,
        game.height - game.textures.get('background-bg').getSourceImage().height,
        game.width,
        game.textures.get('background-bg').getSourceImage().height,
        'background-bg'
    );

    this.backgroundFront = game.add.tileSprite(0,
        game.height - game.textures.get('background-front').getSourceImage().height,
        game.width,
        game.textures.get('background-front').getSourceImage().height,
        'background-front'
    );

    this.backgroundMid = game.add.tileSprite(0,
        game.height - game.textures.get('background-mid').getSourceImage().height,
        game.width,
        game.textures.get('background-mid').getSourceImage().height,
        'background-mid'
    );

    this.backgroundFar = game.add.tileSprite(0,
        game.height - game.textures.get('background-far').getSourceImage().height,
        game.width,
        game.textures.get('background-far').getSourceImage().height,
        'background-far'
    );*/

    // this.backgroundFar.fixedToCamera = true;


    // load the map 
    map = this.make.tilemap({ key: 'map' });

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('terrain', 'tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('Platforms', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion(-1, true);

    // coin image used as tileset
    // var coinTiles = map.addTilesetImage('coin');
    // add coins as tiles
    // coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // coinLayer.setTileIndexCallback(17, collectCoin, game);
    // when the player overlaps with a tile with index 17, collectCoin 
    /*this.backgroundBg = game.add.tileSprite(
        2500,
        1500,
        game.textures.get('background_bg').source[0].width,
        game.textures.get('background_bg').source[0].height,
        'background_bg'
    );
    this.backgroundBg.setOrigin(0, 0);
    this.backgroundBg.setScale(5, 5);
    this.backgroundBg.fixedToCamera = true;
    this.backgroundFar = game.add.tileSprite(
        2500,
        1500,
        game.textures.get('background_back').source[0].width,
        game.textures.get('background_back').source[0].height,
        'background_back'
    );
    this.backgroundFar.setOrigin(0, 0);
    this.backgroundFar.setScale(5, 5);
    this.backgroundFar.fixedToCamera = true;
    this.backgroundMid = game.add.tileSprite(
        2500,
        1500,
        game.textures.get('background_mid').source[0].width,
        game.textures.get('background_mid').source[0].height,
        'background_mid'
    );
    this.backgroundMid.setOrigin(0, 0);
    this.backgroundMid.setScale(5, 5);
    this.backgroundMid.fixedToCamera = true;
    this.backgroundFront = game.add.tileSprite(
        2500,
        1500,
        game.textures.get('background_front').source[0].width,
        game.textures.get('background_front').source[0].height,
        'background_front'
    );
    this.backgroundFront.setOrigin(0, 0);
    this.backgroundFront.setScale(5, 5);
    this.backgroundFront.fixedToCamera = true;

    console.log('fsdsfsdfdfsdf', game.textures.get('background_mid'))
*/

    world = new World(game);
    input = new Input();
    ui = new UI();
    audio = new Audio();

    input.add('A', Phaser.Input.Keyboard.KeyCodes.A, function () { world.player.left(); }, function () { world.player.idle(); });
    input.add('D', Phaser.Input.Keyboard.KeyCodes.D, function () { world.player.right(); }, function () { world.player.idle(); });
    input.add('W', Phaser.Input.Keyboard.KeyCodes.W, function () { world.player.up(); }, function () { world.player.idle(); });
    input.add('SPACE', Phaser.Input.Keyboard.KeyCodes.SPACE, function () { world.player.startShooting(); }, function () { world.player.stopShooting(); });

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, world.player.playerContainer);
    // will be called    
    this.physics.add.overlap(world.player.sprite, coinLayer);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(world.player.playerContainer, false, 1, 1, -200);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    /**/
    pauseGameForInput();

    game.input.on('pointerdown', startGame);
    ///

    this.spikes = this.physics.add.group({
        allowGravity: false,
        immovable: true
    });

    // Let's get the spike objects, these are NOT sprites
    const spikeObjects = map.getObjectLayer('Spikes')['objects'];

    // Now we create spikes in our sprite group for each object in our map
    spikeObjects.forEach(spikeObject => {
        // Add new spikes to our sprite group, change the start y position to meet the platform
        const spike = this.spikes.create(spikeObject.x, spikeObject.y - spikeObject.height, 'spike').setOrigin(0, 0);

        spike.body.setSize(spike.width * 0.8, spike.height * 0.4).setOffset(spike.width * 0.6, spike.height * 1.1);
    });

    // Let's get the spike objects, these are NOT sprites
    const enemyLocations = map.getObjectLayer('Enemies')['objects'];

    // Now we create spikes in our sprite group for each object in our map
    enemyLocations.forEach(location => {
        // Add new spikes to our sprite group, change the start y position to meet the platform
        world.spawnEnemy(location.x + location.width * 0.5, location.y - location.height);
    });

    this.physics.add.collider(world.player.playerContainer, this.spikes, world.player.playerHit, null, this);
}

function pauseGameForInput() {
    console.log('pauseGameForInput');
    game.paused = true;

    input.disable();

    ui.showStartText();
}

function resumeGameFromInput() {
    console.log('resumeGameFromInput');
    ui.disableStartText();

    input.enable();

    game.paused = false;
}

function spawnEnemies() {
    console.log('spawnEnemies');
    if (world.numEnemies > 0)
        return;

    const x = Phaser.Math.Between(50, 150);

    // attempt to display a wave of 3 new enemies
    world.spawnEnemy(x, 1600);
    world.spawnEnemy(x + 110, 1600);
    world.spawnEnemy(x + 220, 1600);

    //audio.fly.play();
}

function startGame() {
    if (!game.paused)
        return;

    console.log("startGame()");

    // game.time.addEvent({ delay: 4000, repeat: -1, callback: spawnEnemies });

    setScore(0);

    resumeGameFromInput();
}

function update(t) {
    time = t;
    // input.update();

    world.update();
}

function onCollisionPlayerEnemy(playerSprite, enemySprite) {
    playerSprite.entity.destroy();
    enemySprite.entity.destroy();
    audio.explode.play();
}

function onCollisionBulletEnemy(enemy, bullet) {
    bullet.destroy();

    enemy.health -= bullet.damage;
    if (enemy.health <= 0) {
        enemy.destroy();
        audio.explode.play();

        world.numEnemies--;
        setScore(game.score + 20);
    }
}

function setScore(value) {
    game.score = value;
    ui.updateScoreText(value);
}

function gameOver() {
    console.log("gameOver()");

    world.cleanup();

    pauseGameForInput();
}

///

// this function will be called when the player touches a coin
function collectCoin(sprite, tile) {
    console.log("collectCoin");
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    setScore(game.score + 20);

    return false;
}