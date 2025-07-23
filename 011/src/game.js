var game = game || {};

game.init = function(publicRoot, exportRoot) {
    //console.log("game");
    this.publicRoot = publicRoot;
    this.exportRoot = exportRoot;
    game.instanComp()
}


/**公共组件 */
var startMc, gl_starBar, titleSound, desSound, isTitleSound, gl_lookAgain, gl_gameWin, gl_level = 0,
    isPlaySound = false;
game.instanComp = function() {
    // //-----展示UI-----
    //main.hideLoad();
    game.showBg();

    //utile.toShow(this.exportRoot["bg"]);
    //绘制UI
    for (var k in config) {
        ////console.log(config[k].isShow)
        if (config[k]["isShow"]) {
            var n = config[k].compName.split("#");
            var l = n.length;

            if (l == 1) {
                if (this.publicRoot[n[0]]) {
                    utile.toShow(this.publicRoot[n[0]]);
                    if (config[k]["playAction"] == "play") {
                        this.publicRoot[n[0]].play();
                    }
                }
                if (this.exportRoot[n[0]]) {
                    utile.toShow(this.exportRoot[n[0]]);
                    if (config[k]["playAction"] == "play") {
                        this.exportRoot[n[0]].play();
                    }
                }
            }
            if (l == 2) {
                if (this.publicRoot[n[0]] && this.publicRoot[n[0]][n[1]]) {
                    utile.toShow(this.publicRoot[n[0]][n[1]]);
                    if (config[k]["playAction"] == "play") {
                        this.publicRoot[n[0]][n[1]].play();
                    }
                }
                if (this.exportRoot[n[0]] && this.exportRoot[n[0]][n[1]]) {
                    utile.toShow(this.exportRoot[n[0]][n[1]]);
                    if (config[k]["playAction"] == "play") {
                        this.exportRoot[n[0]][n[1]].play();
                    }
                }
            }

            if (l == 3) {
                if (this.publicRoot[n[0]] && this.publicRoot[n[0]][n[1]] && this.publicRoot[n[0]][n[1]][n[2]]) {
                    utile.toShow(this.publicRoot[n[0]][n[1]][n[2]]);
                    if (config[k]["playAction"] == "play") {
                        this.publicRoot[n[0]][n[1]][n[2]].play();
                    }
                }
                if (this.exportRoot[n[0]] && this.exportRoot[n[0]][n[1]] && this.exportRoot[n[0]][n[1]][n[2]]) {
                    utile.toShow(this.exportRoot[n[0]][n[1]][n[2]]);
                    if (config[k]["playAction"] == "play") {
                        this.exportRoot[n[0]][n[1]][n[2]].play();
                    }
                }
            }
        }
    }


    // //------开始-----
    gl_startMc = this.publicRoot['gl_startMc'];

    // if (config['gl_startMc#SubTitle'].label) {
    //     //gl_startMc.SubTitle.visible = true;
    //     gl_startMc.SubTitle.TitleLabel.text = config['gl_startMc#TitleLabel'].label;
    //     gl_startMc.SubTitle.SubTitle.text = config['gl_startMc#SubTitle'].label || "";

    // } else {
    //     gl_startMc.TitleLabel.text = config['gl_startMc#TitleLabel'].label;
    // }
    // gl_startMc.BodyLabel.text = config['gl_startMc#BodyLabel'].label || "";
    //stage.addChild(gl_startMc);
    gl_startMc.startBtn.on("click", this.onClickHandler, this);

    // //-----任务星条-----
    gl_starBar = this.publicRoot["gl_starBar"];
    //stage.addChild(gl_starBar)//;
    //确定按钮
    gl_enterBtn = this.publicRoot["enterBtn"];
    //小鼓励
    gl_nextEff = this.publicRoot["nextEffect"];

    // //-----再来一次-----
    gl_lookAgain = game.publicRoot["gl_lookAgain"];
    //stage.addChild(gl_lookAgain);
    //----再听一次------
    gl_soundAgain = game.publicRoot["gl_soundAgain"];
    //stage.addChild(gl_soundAgain);

    gl_gameWin = game.publicRoot["gl_gameWin"];
    //stage.addChild(gl_gameWin);

    gl_gameWin.restartBtn.on("click", game.onReplay);


    game.onPlaySound();
}

/**titleSound */
game.onPlaySound = function() {
    utile.addPlaySound("game", this.onTitleSound.bind(this));
}
/**重新开始 */
game.onReplay = function() {
    createjs.Tween.removeAllTweens();
    gl_level = 0;
    gl_startMc.visible = true;
    gl_gameWin.visible = false;
    gl_gameWin.gotoAndStop(0);
    gl_gameWin.mc.gotoAndStop(0);
    gl_starBar["bigStar"].gotoAndStop(0);
    for (var i = 1; i <= 5; i++) {
        gl_starBar["star" + i].gotoAndStop(0)
    }
    createjs.Sound.stop();
    game.onPlaySound();

}
game.onClickHandler = function(evt) {

    //game.onPlaySound();
    game.showBg(true);
    gl_startMc.visible = false;
    createjs.Sound.stop();

    //游戏逻辑
    switch (template) {
        case 1:
            Template1.init();
            break;
        case 2:
            Template2.init();
            break;
        case 3:
            Template3.init();
            break;
        case 4:
            Template4.init();
            break;
        case 5:
            Template5.init();
            break;
        case 6:
            Template6.init();
            break;
        case 7:
            Template7.init();
            break;
        case 8:
            Template8.init();
            break;
        case 9:
            Template9.init();
            break;

        default:
            console.log("版本不存在");
    }
}

game.onTitleSound = function() {
    utile.addPlaySound("gamedes", this.onBodySound.bind(this))
}

game.onBodySound = function() {
    //console.log("题目介绍完成");
}

game.onErrorHandler = function() {
    //console.log("播放错误")
}

game.onWin = function() {
    utile.addPlaySound("goodmin");
    game.showBg();
    utile.addFrameEnd(gl_starBar["finishEffect"], function() {
        gl_starBar["bigStar"].gotoAndStop(1);
        createjs.Tween.get(gl_gameWin).wait(500).call(() => {
            utile.toShow(gl_gameWin);
            utile.addPlaySound("gamewin");
            gl_gameWin.mc.gotoAndPlay(0);
        })
    });
    gl_starBar["finishEffect"].play();
}

game.showBg = function(val = false) {
    if (val) {
        for (var k of this.exportRoot.children) {
            k.visible = true;
        };
    } else {
        for (var k of this.exportRoot.children) {
            if (k.name != "bg") k.visible = false;
        };
    }
}