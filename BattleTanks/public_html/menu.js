/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */var array;
;
Quintus.TankGameMenu = function (Q) {
    Q.Sprite.extend("Background", {
        init: function (p) {
            this._super(p, {
                x: Q.width / 2,
                y: Q.height / 2 - 30,
                asset: '1.jpg',
                type: 0
            });
        }
    });
    Q.Sprite.extend("Title", {
        init: function (p) {
            this._super({
                y: 40,
                x: Q.width / 2,
                asset: "top.jpg"
            });

        }
    });
    Q.scene("menu", function (stage) {
        //var bg = stage.insert(new Q.Background({type: Q.SPRITE_UI}));
        /*bg.on("touch", function () {
         Q.stageScene("level1");
         });*/



        /*
         
         stage.insert(new Q.UI.Text({
         label: "during the game: use L/R arrow\nkeys to skip levels",
         align: 'center',
         x: Q.width / 2,
         y: 370,
         weight: "normal",
         size: 20
         }));*/
        // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        var container = stage.insert(new Q.UI.Container({
            fill: "black",
            border: 5,
            shadow: 10,
            //shadowColor: "rgba(0,0,0,0.5)",
            y: 140,
            x: Q.width / 2 - 10
        }));
        var verb = Q.touchDevice ? 'Tap' : 'Click';

        var button = container.insert(new Q.UI.Button({x: 10, y: 150, fill: "#CCCCCC",
            label: "Play"}));
        button.on("click,touch", function () {
            //Q.audio.stop();
            Q.clearStages();
            Q.stageScene('level1');
            Q.stageScene("hud", 1);

        });

        var button2 = container.insert(new Q.UI.Button({x: 10, y: 200, fill: "#CCCCCC",
            label: "High Score"}));
        button2.on("click,touch", function () {
            Q.audio.stop();
            Q.clearStages();
            Q.stageScene('highscore');
        });
        var button3 = container.insert(new Q.UI.Button({x: 10, y: 250, fill: "#CCCCCC",
            label: "Sound On/Off"}));
        button3.on("click", function () {
            if (localStorage.sound === "1") {
                localStorage.sound = "0";
            } else {
                localStorage.sound = "1";
            }

        });
        // You can create text labels as well, 
        // pass a second argument to stage.insert
        // to insert elements into containers.
        // Elements in containers move relative to
        // container so (0,0) is the center of the container
        stage.insert(new Q.UI.Text({
            label: "",
            color: "white",
            x: 10,
            y: Q.width / 2 
        }), container);

        // Call container.fit to expand a container
        // to fit all the elemnt in it
        container.fit(290, 150);
                stage.insert(new Q.Title());

        stage.add("viewport");
        /*
         stage.viewport.scale = 1;
         if (window.innerWidth <= 240) {
         stage.viewport.scale = 0.5;
         }
         if (window.innerWidth <= 480) {
         stage.viewport.scale = 1.05;
         } else if (window.innerWidth >= 768) {
         stage.viewport.scale = 2;
         }
         */
    });

    Q.scene("highscore", function (stage) {
        //var bg = stage.insert(new Q.Background({type: Q.SPRITE_UI}));
        /*bg.on("touch", function () {
         Q.stageScene("level1");
         });*/

        stage.insert(new Q.Title());


        /*     
         
         stage.insert(new Q.UI.Text({
         label: "during the game: use L/R arrow\nkeys to skip levels",
         align: 'center',
         x: Q.width / 2,
         y: 370,
         weight: "normal",
         size: 20
         }));*/
        // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        var container = stage.insert(new Q.UI.Container({
            fill: "black",
            border: 5,
            shadow: 10,
            //shadowColor: "rgba(0,0,0,0.5)",
            y: 140,
            x: Q.width / 2 - 10
        }));
        
        var array = JSON.parse(localStorage.scoreboard);
        array.sort(function(a, b){return b-a;});

        var labelnum = 0;
        for (var i = 0; i < 5; i++) {
            labelnum += 50;
            var string = array[i];
            if (string=== undefined ) {
               string = "None";
            }
            stage.insert(new Q.UI.Text({
                label: (i+1) +".      "+ string,
                color: "white",
                x: 10,
                y: labelnum
            }), container);
        }
        // You can create text labels as well, 
        // pass a second argument to stage.insert
        // to insert elements into containers.
        // Elements in containers move relative to
        // container so (0,0) is the center of the container

        var button4 = container.insert(new Q.UI.Button({x: 0, y: 400, fill: "#CCCCCC",
            label: "Back to menu"}));
                button4.on("click,touch", function () {
            Q.audio.stop();
            Q.clearStages();
            Q.stageScene('menu');
        });
        // Call container.fit to expand a container
        // to fit all the elemnt in it
        container.fit(250, 150);
        stage.add("viewport");
        /*
         stage.viewport.scale = 1;
         if (window.innerWidth <= 240) {
         stage.viewport.scale = 0.5;
         }
         if (window.innerWidth <= 480) {
         stage.viewport.scale = 1.05;
         } else if (window.innerWidth >= 768) {
         stage.viewport.scale = 2;
         }
         */
    });
};