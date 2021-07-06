//Dummy JSON responses
let data = [

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 4, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 1,
                "symbolIDs": [0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 2,
                "symbolIDs": [1, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [2, 1, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 3,
                "symbolIDs": [2, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 4, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 9,
                "symbolIDs": [5, 3, 2, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [4, 0, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 1,
                "symbolIDs": [1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [1, 2, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [0, 2, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [0, 2, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [0, 1, 2, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

]

// game defaults
let config  = {
    reels: 5,
    balance: 100,
    stakeControl: {
        min: 1,
        max: 10,
    }
}

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

let app;

let slotMachine;
let slotSymbols;
let slotControls;

// wait for DOM before creating application
window.addEventListener('load', function() {
    //Create a Pixi Application
    app = new PIXI.Application({width: 800, height: 600});

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    app.loader
        .add('cherry', 'assets/symbols/symbol_00.json')
        .add('lemon', 'assets/symbols/symbol_01.json')
        .add('orange', 'assets/symbols/symbol_02.json')
        .add('plum', 'assets/symbols/symbol_03.json')
        .add('grapes', 'assets/symbols/symbol_04.json')
        .add('watermelon', 'assets/symbols/symbol_05.json')
        .load(onAssetsLoaded);
});

function onAssetsLoaded(loader, res) {

    // reuse symbols
    slotSymbols = [
        res.cherry.spineData,
        res.lemon.spineData,
        res.orange.spineData,
        res.plum.spineData,
        res.grapes.spineData,
        res.watermelon.spineData
    ];

    const margin = (app.screen.height - SYMBOL_SIZE) * 0.5;
    
    slotMachine = new SlotMachine();
    slotMachine.y = (margin * 2) - SYMBOL_SIZE;
    slotMachine.x = Math.round(app.screen.width - REEL_WIDTH * 5);

    slotControls = new SlotControls(margin);   

    // add loops to ticker
    app.ticker.add(gameLoop);
    app.ticker.add(tweenLoop);
}

class SlotMachine extends PIXI.Container {

    constructor() {        
        super();

        this.reels = [];

        this.init();
    }

    init() {
        // create reels
        for (let i = 0; i < config.reels; i++) {
            let x = i * REEL_WIDTH;
            let reel = new Reel(x);
            this.addChild(reel);
            this.reels.push(reel);
        }
        app.stage.addChild(this);
    }
}

class Reel extends PIXI.Container {

    constructor(x) {        
        super();
        this.x = x;
    
        this.reelFilter = {
            container: this,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter(),
        };
        this.reelFilter.blur.blurX = 0;
        this.reelFilter.blur.blurY = 0;
        this.filters = [this.reelFilter.blur];
    
        this.init();
    }

    init() {
        // generate symbols
        for (let j = 0; j < 4; j++) {
            const rand = Math.floor(Math.random() * slotSymbols.length);
            const symbol = new PIXI.spine.Spine(slotSymbols[rand]);

            // set id
            symbol.id = rand;
            
            symbol.y = j * SYMBOL_SIZE;
            symbol.x = Math.round(((SYMBOL_SIZE - symbol.width) * 0.5) + REEL_WIDTH * 0.5);

            // set up the mixes!
            symbol.stateData.setMix('static', 'win', 0.2);
            symbol.stateData.setMix('win', 'static', 0.4);

            symbol.playAnimation = ()=> {
                symbol.state.setAnimation(0, 'win', false);
                symbol.state.addAnimation(0, 'static', true, 0);
            }

            this.reelFilter.symbols.push(symbol);
            this.addChild(symbol);
        }
    }
}

class SlotControls extends PIXI.Container {

    constructor(margin) {        
        super();        

        this.x = 0;
        this.y = app.screen.height - margin;
        this.margin = margin;
        this.currentBalance = config.balance;  
        this.currentStake = Math.min(config.balance, config.stakeControl.min);     

        this.init();
    }

    init() {
        // build top and bottom covers to define play area
        let top = this.top = new PIXI.Graphics();
        top.beginFill(0x00264F);
        top.drawRect(0, 0, app.screen.width, this.margin);
        top.endFill();
        let bottom = this.bottom = new PIXI.Graphics();
        bottom.beginFill(0x00264F);
        bottom.drawRect(0, SYMBOL_SIZE + this.margin, app.screen.width, this.margin);
        bottom.endFill();

        // create header text
        let headerText = this.headerText = new PIXI.Text('1X2 NETWORK SLOTS', {fontSize: 36, fontStyle: 'italic', fontWeight: 'bold', fill: "#ffffff"});
        headerText.x = Math.round(top.width * 0.5);
        headerText.y = this.margin * 0.5;
        headerText.anchor.set(0.5);

        top.addChild(headerText);

        // create bottom text
        let balanceHeader = this.balanceHeader = new PIXI.Text('Current Balance:', {fontSize: 22, fontStyle: 'italic', fontWeight: 'bold', fill: "#ffffff"});
        balanceHeader.x = Math.round(this.bottom.width * 0.5);
        balanceHeader.y = app.view.height - (this.margin * 0.75);
        balanceHeader.anchor.set(0.5, 0);
        let balanceText = this.balanceText = new PIXI.Text(this.currentBalance, {fontSize: 36, fontStyle: 'italic', fontWeight: 'bold', fill: "#ffffff"});
        balanceText.x = Math.round(bottom.width * 0.5);
        balanceText.y = app.view.height - (this.margin * 0.5);
        balanceText.anchor.set(0.5);

        bottom.addChild(balanceHeader);
        bottom.addChild(balanceText);

        app.stage.addChild(top);
        app.stage.addChild(bottom);
        
        let padding = 20,
            width = 50,
            height = 50,
            gap = 100,
            color = {
                front: 0xFFFFFF,
                back: 0x8F8F8F
            };

        // slot controls
        this.minusButton = new Button(
            this.x + padding,
            Math.round((app.view.height - (this.margin * 0.5)) - (height * 0.5)),
            width, height, color, "minus", "-"
        );
        this.minusButton.addListener('pointerdown', () => {
            this.decreaseStake();
        });
        this.plusButton = new Button(
            (this.x + padding) + (width + gap),
            Math.round((app.view.height - (this.margin * 0.5)) - (height * 0.5)),
            width, height, color, "plus", "+"
        );
        this.plusButton.addListener('pointerdown', () => {
            this.increaseStake();
        });

        // create spin button
        let spinButtonWidth = (padding + gap) + (width * 2);
        let spinButtonHeight = (this.margin * 0.5) - (padding * 2);
        this.spinButton = new Button(
            (app.view.width - padding) - spinButtonWidth,
            ((app.view.height - this.margin) + (padding * 2)) + (spinButtonHeight * 0.5),
            spinButtonWidth, spinButtonHeight, color, "spin", "SPIN", {fontSize: 30}
        );
        this.spinButton.addListener('pointerup', () => {
            this.spin();
        });
        
        // show current stake
        let stakeHeader = this.stakeHeader = new PIXI.Text("Stake", {fontSize: 22, fill: '#ffffff'});
        stakeHeader.x = Math.round(((padding + width) + (gap * 0.5)) - (stakeHeader.width * 0.5));
        stakeHeader.y = app.view.height - (this.margin * 0.75);

        let stakeText = this.stakeText = new PIXI.Text(this.currentStake < 10 ? "0" + this.currentStake : this.currentStake, {fontSize: 36, fill: '#ffffff'});
        stakeText.anchor.set(0.5);
        stakeText.x = Math.round((padding + width) + (gap * 0.5));
        stakeText.y = app.view.height - (this.margin * 0.5);

        app.stage.addChild(stakeHeader);
        app.stage.addChild(stakeText); 
    }

    spin() {
        if (this.currentStake <= 0) {
            return;
        }
        this.updateBalance(-this.currentStake);

        let x = app.view.width * 0.5;
        let y = app.view.height - (slotControls.margin * 0.25);
        let duration = 2500;
        displayText(`- ${this.currentStake < 10 ? "0" + this.currentStake : this.currentStake}`, x, y, duration, {fontSize: 30, fill: '#ff0000'}, true, 1000, 0x00264F);

        // update stake to remaining balance if needed
        if (this.currentBalance < this.currentStake) {
            this.currentStake = this.currentBalance;
            this.stakeText.text = this.currentStake < 10 ? "0" + this.currentStake : this.currentStake;
        }

        this.setInteractive(false);
        this.animateReels();
    }

    animateReels() {        
        for (let i = 0; i < slotMachine.reels.length; i++) {
            const r = slotMachine.reels[i].reelFilter;
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            tweenTo(r, 'position', target, time, backout(0.5), null, i === slotMachine.reels.length - 1 ? spinComplete : null);
        }
    }

    updateBalance(number) {
        if (!number) {
            return;
        }
        this.currentBalance += number;

        this.updateText(this.balanceText, this.currentBalance);
    }

    updateText(displayObject, text) {
        text = text.toString();
        if (text && displayObject != null) {
            displayObject.text = text;
        }
    }

    decreaseStake() {
        if (this.currentStake <= 0) {
            return;
        }
        this.currentStake -= 1;

        this.updateText(this.stakeText, this.currentStake < 10 ? "0" + this.currentStake : this.currentStake);
    }

    increaseStake() {
        if (this.currentStake >= config.stakeControl.max || this.currentBalance <= this.currentStake) {
            return;
        }
        this.currentStake += 1;

        this.updateText(this.stakeText, this.currentStake < 10 ? "0" + this.currentStake : this.currentStake);
    }

    setInteractive(bool) {
        this.minusButton.interactive = bool;
        this.plusButton.interactive = bool;
        this.spinButton.interactive = bool;
    }
}

class Button extends PIXI.Graphics {

    constructor(x, y, w, h, color, name, text, style) {        
        super();

        let background = new PIXI.Graphics();
        background.beginFill(color.back);
        background.drawRoundedRect(x, y + 10, w, h, 10);
        background.endFill();
        this.beginFill(color.front);
        this.drawRoundedRect(x, y, w, h, 10);
        this.endFill();
        
        this.interactive = true;
        this.buttonMode = true;

        this.name = name;
        
        if (text) {
            if (style) {
                this.textStyle = new PIXI.TextStyle(style);
                this.text = new PIXI.Text(text, this.textStyle);
            } else {
                this.text = new PIXI.Text(text);
            }
            this.text.x = Math.round(((x + w) - (w * 0.5)) - this.text.width * 0.5);
            this.text.y = Math.round(((y + h) - (h * 0.5)) - this.text.height * 0.5);
            
            this.addChild(this.text);
        }
        app.stage.addChild(background);
        app.stage.addChild(this);

        this.setListeners();
    }

    setListeners() {
        this.addListener('pointerdown', () => {
            this.y += 5;
        });
        this.addListener('pointerup', () => {
            this.y -= 5;
        });
    }
}

function spinComplete() {
    slotControls.setInteractive(true);

    requestResult()
        .then(res => {
            checkResult(res);
        })
        .catch(err => {
            // log error
            console.error(err);
        });
}

function requestResult() {
    // request result from server
    return new Promise((resolve, reject) => {
        // get random result
        let randomNumber = randomNumberBetween(0, data.length - 1);
        let response = data[randomNumber];
        if (response != null) {
            resolve(response);
        } else {
            reject("Server error");
        }
    });
}

function checkResult(res) {
    const results = res.response.results;

    if (results.win) {
        // go through each reel
        slotMachine.reels.forEach(reel => {
            let spine = null;

            // find symbols in play area
            for (let i = 0; i < reel.children.length; i++) {
                const symbol = reel.children[i];
                
                if (symbol.transform.worldTransform.ty > (app.view.height * 0.5) - (SYMBOL_SIZE * 0.5) && symbol.transform.worldTransform.ty < (app.view.height * 0.5) + (SYMBOL_SIZE * 0.5)) {
                    spine = symbol;
                    break;
                }
            }

            // check for match
            if (spine != null) {
                for (let j = 0; j < results.symbolIDs.length; j++) {
                    const id = results.symbolIDs[j];

                    if (spine.id == id) {
                        spine.playAnimation();
                        break;
                    }
                }
            }
        });
        handleWin(results);
    } else {
        handleLoss();
    }
}

function handleWin(results) {
    let multiplier = results.win;
    let reward = (slotControls.currentStake * multiplier);

    slotControls.updateBalance(reward);

    // display reward
    let x = app.view.width * 0.5;
    let y = app.view.height - (slotControls.margin * 0.25);
    let duration = 2500;
    displayText(`+ ${reward < 10 ? "0" + reward : reward}`, x, y, duration, {fontSize: 30, fill: '#32cd32'}, true, 1000, 0x00264F);

    // flash win text
    setTimeout(()=> { displayText("WIN!!!", x, slotControls.margin * 0.75, 0, {fontSize: 40, fill: '#ebd33d', fontStyle: 'italic'}, true, 200); }, 400);
    setTimeout(()=> { displayText("WIN!!!", x, slotControls.margin * 0.75, 0, {fontSize: 40, fill: '#ebd33d', fontStyle: 'italic'}, true, 200); }, 800);
    setTimeout(()=> { displayText("WIN!!!", x, slotControls.margin * 0.75, 500, {fontSize: 40, fill: '#ebd33d', fontStyle: 'italic'}, true, 2000); }, 1200);
    displayText("WIN!!!", x, slotControls.margin * 0.75, 0, {fontSize: 40, fill: '#ebd33d', fontStyle: 'italic'}, true, 200, null);
}

function handleLoss() {
    let x = app.view.width * 0.5;
    let y = slotControls.margin * 0.75;
    let duration = 500;
    displayText("Try Again!", x, y, duration, {fontSize: 38, fill: '#ffffff', fontStyle: 'italic'}, true, 2000, null);
}

function displayText(text, x, y, duration, style, centered, delay, background) {
    let textObject = new PIXI.Text(text, style);
    if (centered) {
        textObject.anchor.set(0.5);
    }
    textObject.x = x;
    textObject.y = y;

    if (background != null) {
        let textGraphic = new PIXI.Graphics();

        textGraphic.beginFill(background);
        textGraphic.drawRect(textObject.x - textObject.width, textObject.y - textObject.height, textObject.width * 2, textObject.height * 2);
        textGraphic.endFill();
        
        app.stage.addChild(textGraphic);
    }
    app.stage.addChild(textObject);
    
    if (delay >= 0) {
        setTimeout(()=> {
            tweenTo(textObject, 'alpha', 0, duration, backout(0), null, ()=> {textObject.destroy();});
        }, delay);
    } else {
        tweenTo(textObject, 'alpha', 0, duration, backout(0), null, ()=> {textObject.destroy();});
    }
}

function randomNumberBetween(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Slots demo loop from pixijs.
// https://pixijs.io/examples/#/demos-advanced/slots.js
function gameLoop(delta) {
    // Update the slots.
    for (let i = 0; i < slotMachine.reels.length; i++) {
        const r = slotMachine.reels[i].reelFilter;
        // Update blur filter y amount based on speed.
        // This would be better if calculated with time in mind also. Now blur depends on frame rate.
        r.blur.blurY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;

        // Update symbol positions on reel.
        for (let j = 0; j < r.symbols.length; j++) {
            const s = r.symbols[j];
            const prevy = s.y;
            s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
            if (s.y < 0 && prevy > SYMBOL_SIZE) {
                // Detect going over and swap a texture.
                // This should in proper product be determined from some logical reel.
                s.texture = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                s.x = Math.round(((SYMBOL_SIZE - s.width) * 0.5) + REEL_WIDTH * 0.5);
            }
        }
    }
}

const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}

function tweenLoop() {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
}

// Basic lerp funtion.
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount) {
    return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}