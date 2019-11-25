class Audio {
    constructor() {
        this.intro = game.sound.add('intro');
        //this.intro.play();
        this.bg = game.sound.add('bg', true);
        //this.bg.play();
        this.explode = game.sound.add('explode');
        this.fly = game.sound.add('fly');
        this.shoot = game.sound.add('shoot');
    }
}

class Input {
    constructor() {
        this.keys = {};
        this.keyMap = new Map();

        this.enabled = false;
    }

    add(key, keyCode, downAction, upAction) {
        this.keys[key] = game.input.keyboard.addKey(keyCode);
        // this.keyMap.set(game.input.keyboard.addKey(key), action);
        let eventString;
        if (downAction) {
            eventString = 'keydown_' + key;
            game.input.keyboard.on(eventString, function (event) {
                if (this.enabled) {
                    downAction();
                }
            }, this);
        }
        if (upAction) {
            eventString = 'keyup_' + key;
            game.input.keyboard.on(eventString, function (event) {
                if (this.enabled) {
                    upAction();
                }
            }, this);
        }
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    /*update() {
        for (const [key, action] of this.keyMap.entries()) {
            if (key.isDown) {
                action();
            }
        }
    }*/
}

class UI {
    constructor() {
        this.startGameText = game.add.text(game.cameras.main.width * 0.5, game.cameras.main.height * 0.5, 'Click to Start', {
            font: '30px Arial',
            fill: '#fff'
        });
        this.startGameText.setOrigin(0.5, 0.5);

        this.scoreText = game.add.text(10, 10, 'Score: 0', {
            font: '34px Arial',
            fill: '#fff'
        });

        this.scoreText.setScrollFactor(0);
        this.startGameText.setScrollFactor(0);
    }

    updateScoreText(newScore) {
        this.scoreText.setText('Score: ' + newScore);
    }

    showStartText() {
        this.startGameText.visible = true;
    }

    disableStartText() {
        this.startGameText.visible = false;
    }
}
