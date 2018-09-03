// # Quintus platformer example
//
// [Run the example](../quintus/examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a level json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
if (localStorage.getItem("scoreboard") === null) {
localStorage.scoreboard = "[0]";
}
window.addEventListener("load", function () {

// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` componet.

    var Q = window.Q = Quintus()
            .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX,Audio")
            .include("TankGameMenu")

            // Maximize this game to whatever the size of the browser is
            .setup({maximize: true})
            .enableSound()
            // And turn on default input controls and touch input (for UI)
            .controls(true).touch();

    Q.gravityX = 0;
    Q.gravityY = 0;
    Q.SPRITE_BULLET = 2;
    Q.score = 0;
    Q.level = 1;

// ######################### Components ##############################
    Q.component("PlayerControl", {
        defaults: {speed: 0, direction: 'up'},

        added: function () {
            var p = this.entity.p;

            // add in our default properties
            Q._defaults(p, this.defaults);

            // every time our entity steps
            // call our step method
            this.entity.on("step", this, "step");
            //this.entity.play("run");
        },
        step: function (dt) {
            // grab the entity's properties
            // for easy reference
            p = this.entity.p;
            p.delta = 3;
            // rotate the player
            if (Q.inputs['left'])
            {
                p.x = p.x - p.delta;
                p.angle = -90;
            } else if (Q.inputs['down']) {
                p.y = p.y + p.delta;
                p.angle = 180;
            } else if (Q.inputs['up']) {
                p.y = p.y - p.delta;
                p.angle = 0;

            } else if (Q.inputs['right'])
            {
                p.x = p.x + p.delta;
                p.angle = 90;

                //p.angle = 270;
            }

        }
    });
    Q.component("reposition", {

        added: function () {

            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            var p = this.entity.p;
            var maxSide = Math.sqrt(p.h * p.h + p.w + p.w);
            var a = Math.floor((Math.random() * 300) + 100);

            if (p.vx === 0 && p.vy === 0) {
                p.x = a;
                p.y = Q.width / 2;
                this.entity.p.angle = 270;
                this.entity.p.vx = -50;
            }
        }

    });
    Q.component('aialp', {
        defaults: {directions: 1},

        added: function () {
            var p = this.entity.p;

            Q._defaults(p, this.defaults);

            this.entity.on("bump.right", this, "goDown");
            this.entity.on("bump.left", this, "goUp");
            this.entity.on("bump.top", this, "goRight");
            this.entity.on("bump.bottom", this, "goLeft");

        },
        luck: function (col) {
            var luck = parseInt(Math.floor((Math.random() * 4) + 1));
            console.log(luck);
            if (luck === 1) {
                console.log(luck);

                this.entity.on("goLeft");
            } else if (luck === 2) {
                console.log(luck);

                this.entity.on("goRight");

            } else if (luck === 3) {
                console.log(luck);

                this.entity.on("goUp");

            } else if (luck === 4) {

                console.log(luck);
                this.entity.on("goDown");

            }

        },
        goLeft: function (col) {
            //console.log("Left");

            this.entity.p.angle = 270;
            this.defaults.directions = 0;


            this.entity.p.vx = -col.impact;
            if (this.entity.p.defaultDirection === 'right') {
                this.entity.p.flip = 'x';
            } else {
                this.entity.p.flip = false;
            }
        },

        goRight: function (col) {
            //console.log("Right");
            //this.entity.p.x -= 30;
            // this.entity.p.y = -30;
            this.entity.p.vx = col.impact;
            this.entity.p.angle = 90;
            if (this.entity.p.defaultDirection === 'left') {
                this.entity.p.flip = 'x';
            } else {
                this.entity.p.flip = false;
            }
        },
        goUp: function (col) {
            //  this.entity.p.x += 30;
            // this.entity.p.y -= 30;
            // console.log("Up");
            this.entity.p.vy = -col.impact;
            this.entity.p.angle = 0;
            if (this.entity.p.defaultDirection === 'down') {
                this.entity.p.flip = 'y';
            } else {
                this.entity.p.flip = false;
            }
        },
        goDown: function (col) {

            //console.log("Down");

            this.entity.p.vy = col.impact;
            this.entity.p.angle = 180;
            if (this.entity.p.defaultDirection === 'down') {
                this.entity.p.flip = 'y';
            } else {
                this.entity.p.flip = false;
            }
        }
    });



    Q.Sprite.extend("Bullet", {
        init: function (p) {

            this._super(p, {
                w: 5,
                h: 5,
                type: Q.SPRITE_BULLET,
                collisionMask: Q.SPRITE_DEFAULT,
                person: ""
            });

            this.add("2d");
            this.on("bump", this, "collision");
            this.on("duvar", this, "collision");
        },

        collision: function (col) {

            //var objP = col.obj.p;
            //console.log(col.obj);

            this.destroy();

            //col.obj.destroy();
            //this.destroy();
        },

        draw: function (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h);
        },

        step: function (dt) {
            if (!Q.overlap(this, this.stage.collisionLayer)) {
                this.destroy();
            }
        }
    });
    // ## Player Sprite
    Q.Sprite.extend("Player", {

        // the init constructor is called on creation
        init: function (p) {

            this._super(p, {
                sheet: "player",    
                speed: 10,
                points: [[0, -20], [5, 10], [-5, 10]],
                bulletSpeed: 500,
                collisionMask: Q.SPRITE_DEFAULT
            });

            this.add('2d ,PlayerControl');
            Q.input.on("fire", this, "fire");
            this.on("hit.sprite", function (collision) {

                if (collision.obj.isA("Bullet")) {
                    if (collision.obj.p.person !== "Player") {
                        console.log("Player Class");
                        Q.stageScene("endGame", 1, {label: "You Lose!"});
                        this.destroy();
                    }
                }
            });

        },
        fire: function () {
            if (localStorage.sound === "1") {

                Q.audio.play("fire.mp3");
            }
            var p = this.p;
            var dx = Math.sin(p.angle * Math.PI / 180),
                    dy = -Math.cos(p.angle * Math.PI / 180);
            this.stage.insert(
                    new Q.Bullet({x: this.c.points[0][0],
                        y: this.c.points[0][1],
                        vx: dx * p.bulletSpeed,
                        vy: dy * p.bulletSpeed,
                        person: "Player", collisionMask: Q.SPRITE_DEFAULT
                    })
                    );


        }
    });


// ## Wall Sprite
// Sprites can be simple, 
    Q.Sprite.extend("Duvar", {
        init: function (p) {
            this._super(p, {sheet: 'duvar'});
            this.on("hit.sprite", function (collision) {
                if (collision.obj.isA("Bullet")) {
                    this.destroy();
                    collision.obj.destroy();
                }
                if (collision.obj.isA("Player")) {
                    collision.obj.p.vx = -collision.impact;
                    collision.obj.p.vy = -collision.impact;


                }
            });
        }
    });
    Q.Sprite.extend("Eagle", {
        init: function (p) {
            this._super(p, {sheet: 'eagle'});
            this.on("hit.sprite", function (collision) {
                if (collision.obj.isA("Bullet")) {
                    Q.stageScene("endGame", 1, {label: "You Lose!"});
                    this.destroy();
                }
            });
        }
    });

// ## Enemy Sprite
// Create the Enemy class to add in some baddies
    var enemynum1 = 5;
    Q.Sprite.extend("Enemy", {

        init: function (p) {
            this._super(p, {sheet: 'enemy', speed: 100,
                points: [[0, -10], [5, 10], [-5, 10]],
                bulletSpeed: 500, vx: 100, visibleOnly: true, immuneTimer: 0
            });

            this.add('2d,aialp,reposition');


            this.on("hit.sprite", function (col) {
                if (col.obj.isA("Bullet")) {
                    if (localStorage.sound === "1") {

                        Q.audio.play("die.mp3");
                    }
                    Q.score += 1;

                    var coinsLabel = Q("UI.Text", 1).items[1];
                    coinsLabel.p.label = 'Score : ' + Q.score;
                    this.destroy();
                    col.obj.destroy();
                    enemynum1--;

                    if (enemynum1 === 0) {
                        enemynum1 = 5;
                        Q.level += 1;
                        if (Q.level === 5) {

                            Q.level = 1;
                            Q.audio.stop();
                            Q.clearStages();
                            Q.stageScene("endGame", 1, {label: "You Win!"});

                            return;
                        }
                        Q.clearStages();
                        Q.stageScene("level" + Q.level);
                    }
                }

            });
        },
        step: function () {
            //console.log(this.p.immuneTimer);
            this.p.immuneTimer++;
            if (this.p.immuneTimer > 144) {
                // 3 seconds expired, remove immunity.
                // console.log("Fire!!!");
                if (localStorage.sound === "1") {

                    Q.audio.play("fire.mp3");
                }
                var p = this.p;
                var dx = Math.sin(p.angle * Math.PI / 180),
                        dy = -Math.cos(p.angle * Math.PI / 180);
                this.stage.insert(
                        new Q.Bullet({x: this.c.points[0][0],
                            y: this.c.points[0][1],
                            vx: dx * p.bulletSpeed,
                            vy: dy * p.bulletSpeed,
                            person: "Enemy"
                        })
                        );
                this.p.immuneTimer = 0;
            }
        }
    });



// ############################# Scene Contoller ########################################################3

    Q.scene("level1", function (stage) {
        Q.stageTMX("level1.tmx", stage);
        if (localStorage.sound === "1") {
            Q.audio.play("stage_start.mp3");
        }
        setTimeout(function () {
            if (localStorage.sound === "1") {

                Q.audio.play("Loopgamesound.mp3", {loop: true});
            }
        }, 4000);

        stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});

    });
    Q.scene("level2", function (stage) {
        Q.stageTMX("level2.tmx", stage);
        Q.audio.stop();

        Q.stageScene("hud", 1);

        if (localStorage.sound === "1") {

            Q.audio.play("stage_start.mp3");
        }
        setTimeout(function () {
            if (localStorage.sound === "1") {

                Q.audio.play("Loopgamesound.mp3", {loop: true});
            }
        }, 4000);

        stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});

    });
    Q.scene("level3", function (stage) {
        Q.stageTMX("level3.tmx", stage);
        Q.audio.stop();

        Q.stageScene("hud", 1);

        if (localStorage.sound === "1") {

            Q.audio.play("stage_start.mp3");
        }
        setTimeout(function () {
            if (localStorage.sound === "1") {

                Q.audio.play("Loopgamesound.mp3", {loop: true});
            }
        }, 4000);

        stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});

    });
    Q.scene("level4", function (stage) {
        Q.stageTMX("level4.tmx", stage);
        Q.audio.stop();

        Q.stageScene("hud", 1);

        if (localStorage.sound === "1") {

            Q.audio.play("stage_start.mp3");
        }
        setTimeout(function () {
            if (localStorage.sound === "1") {

                Q.audio.play("Loopgamesound.mp3", {loop: true});
            }
        }, 4000);

        stage.add("viewport").follow(Q("Player").first(), {x: true, y: true});

    });



    Q.scene('endGame', function (stage) {
        var asd = localStorage.scoreboard;
        if (localStorage.switch1 !== "1") {
            localStorage.scoreboard = JSON.stringify([0]);
        }
        localStorage.switch1 = "1";

        var score1 = [Q.score];
        var temp = localStorage.scoreboard;
        temp = JSON.parse(temp);
        temp.push(score1);
        localStorage.scoreboard = JSON.stringify(temp);
        Q.score = 0;
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2, y: Q.height / 2, fill: "rgba(0,0,0,0.5)"
        }));

        var button = container.insert(new Q.UI.Button({x: 0, y: 0, fill: "white",
            label: "Play Again"}));
        var button1 = container.insert(new Q.UI.Button({x: 0, y: -50, fill: "white",
            label: "Menu"}));
        var label = container.insert(new Q.UI.Text({x: 10, y: -70 - button.p.h, color: "white",
            label: stage.options.label}));
        button.on("click", function () {
            Q.audio.stop();
            Q.clearStages();
            Q.level = 1;
            Q.stageScene('hud', 1);
            Q.stageScene('level1');
        });
        button1.on("click", function () {
            Q.level = 1;
            Q.audio.stop();
            Q.clearStages();
            Q.stageScene('menu');
        });

        container.fit(20);
    });

    Q.scene("loading", function (stage) {
        stage.insert(new Q.UI.Text({
            label: "Loading...",
            x: Q.width / 2,
            y: Q.height / 2
        }));
        loadAssetsAndGo();
    });
    Q.scene('hud', function (stage) {

        var container = stage.insert(new Q.UI.Container({
            x: window.innerWidth / 2, y: 0
        }));
        var level = container.insert(new Q.UI.Text({x: -125, y: 20,
            label: "Level: " + Q.level, color: "white", align: "center"}));
        var score = container.insert(new Q.UI.Text({x: 125  , y: 20,
            label: "Score: " + Q.score, color: "white", align: "center"}));
    });

    Q.stageScene("loading");


    function loadAssetsAndGo() {

        Q.load("level1.tmx, level2.tmx, level3.tmx, level4.tmx ,top.jpg, bg_prerendered.png, logo.png, 1.jpg, sprites.json, tank1.png, battlemaptiles.png, Loopgamesound.mp3, stage_start.mp3, fire.mp3, die.mp3,background-wall.png", function () {
            Q.compileSheets("tank1.png", "sprites.json");
            //Q.compileSheets("duvar.png","sprites_1.json");
            Q.clearStages();
            Q.stageScene("menu");

        });
    }


// ## To Do List:
// 
// 
// 
// 1. Eagle Object +
// 2. End Game +
// 3. Menu +
// 4. Sound ON / OFF ?
// 5. Level 2 ,3 ,4 Map +
// 6. Joypad Contoller +
// 7. Wall Problem + 
// 8. Score +
// 9. High Score + 
// 10. Bullet Problem 
// 11. leve1 label +


});
