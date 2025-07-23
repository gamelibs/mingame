/**看图识字 */
/**
 * 老虎寻美味
 * 记忆出现的汉字，再点击带有正确汉字
 */
var Template2 = Template2 || {};
/**动画组UI */
Template2.stateUIArr = []
/**答案组UI */
Template2.answerUIArr = [];
/**错误UI */
Template2.answerUIWrongArr = [];
/**答案组数据 */
Template2.answerList = [];

/**答案音数据 */
Template2.answerWordArr = [];
/**答案长度 */
Template2.answerlong = 2;
/**预定义文本 */
Template2.wordArr = [];
/**预定义声音 */
Template2.soundArr = [];
/**临时公共 */
Template2.tempCom = null;
/**题目word */
Template2.showTipic = null;
/**当前关卡 */
Template2.totallLevel = 5;
Template2.isOnce = true;
Template2.isFirst = true;
Template2.isGame = true;
Template2.currWord = null;
Template2.currText = null;
Template2.options = null;
/**赋值错误文本 */
Template2.wrongWord = [];
//初始化
Template2.init = function () {

    this.initData();

    this.initUI();

    this.initEvent();

};

/**数据动作 */
Template2.initData = function () {
    //字库
    Template2.wordArr = config.wordArr.labelArr;
    //音库
    //默认"word"+number;
    ///Template2.soundArr = config.soundArr.mp3Arr;
    //动画UI
    this.wuya = game.exportRoot["wuya"];
    if (this.wuya) {
        this.stateUIArr = this.wuya["children"];
        // for (var k in this.stateUIArr) {

        // }
    }
    //答案UI
    var answer = game.exportRoot["options"];
    if (answer) {
        for (var k in answer["children"]) {
            if (answer["children"][k].name == "wrong") {
                var tempMc = answer["children"][k]["children"];
                for (var l in tempMc) {
                    this.answerUIWrongArr.push(tempMc[l]);
                }
            } else {
                this.answerUIArr.push(answer["children"][k]);
            }
        }
    }
    //随机答案库
    this.randomAnser();
}

/**UI动作 */
Template2.initUI = function () {
    this.showTipic = game.exportRoot["showTips"];
    utile.toShow(this.showTipic);
    // this.stateUIArr["stand"].play();
    utile.toShow(this.showTipic);
    game.exportRoot["shizi"].play()
    //出题
    this.playWord();
}

/**事件 */
Template2.initEvent = function () {
    for (var k in this.answerUIArr) {
        this.answerUIArr[k].on("click", this.onClickHandler, this);
    }
    //再来一次
    gl_lookAgain.on("click", this.onClickHandler, this);
}
Template2.reEvent = function () {
    for (var k in this.answerUIArr) {
        this.answerUIArr[k].removeAllEventListeners();
    }
    gl_lookAgain.removeAllEventListeners();
}

/**展示文字题目 */
Template2.playWord = function () {
    if (gl_level >= this.totallLevel) return;
    for (var k in this.stateUIArr) {
        this.stateUIArr[k].visible = false;
        this.stateUIArr[k].gotoAndStop(0);
        if (this.stateUIArr[k].name == "stand") {
            this.stateUIArr[k].visible = true;
            this.stateUIArr[k].play();
        }
    }
    if (this.isOnce) {
        //赋值
        this.currWord = this.answerWordArr[gl_level];
        // var _frame = //this.wordArr[this.currWord];
        this.showTipic.gotoAndStop(this.currWord)
        // this.showTipic.lable.text = _text;
        // this.currText = _text;
    }
    console.log("正确答案为:", this.currWord)

    //播发一次动画
    if (this.isFirst) {
        this.isFirst = false;
        this.onHideAnswer();
        this.onHideWrongAnser();
        utile.delayTimer(200, function () {
            this.showTipic.visible = true;
            createjs.Tween.get(this.showTipic)
                .wait(200)
                .call(this.onceHandler.bind(this));

        }.bind(this));
    } else {
        this.showTipic.visible = true;
        createjs.Tween.get(this.showTipic)
            .wait(200)
            .call(this.onceHandler.bind(this));
    }
}

/**展示答案 */
Template2.onceHandler = function () {
    this.isGame = false;
    // this.showTipic.visible = false;
    if (this.isOnce) {
        this.isOnce = false;
        //赋值
        this.setAnserUI(this.answerList[gl_level])
        //显示答案
        if (!this.options) {
            this.options = game.exportRoot["options"];
            utile.toShow(this.options);
        }
        this.onHideAnswer(true);
        this.onHideWrongAnser();
    }
    //再看一次
    // utile.toShow(gl_lookAgain);
};

/**点击事件 */
Template2.onClickHandler = function (evt) {
    //console.log(evt.currentTarget);
    var o = evt.currentTarget
    var str = o.name.replace(/[^a-z]/ig, "");
    var num = o.name.replace(/[^0-9]/ig, "");
    if (this.isGame) return;
    this.isGame = true;

    if (str == "mc") {
        this.tempCom = o.name;


        if (o.children[1].currentFrame == this.answerWordArr[gl_level]) {
            //console.log("回答正确");
            gl_lookAgain.visible = false;
            utile.addPlaySound("word" + this.currWord, this.onWordSound.bind(this));
        } else {
            //console.log("回答错误");
            this.playMissedMc(this.tempCom);
            //utile.addPlaySound("try");
        }

    }


};

/**声音错误 */
Template2.onErrorHandler = function (evt) {
    console.log("mp3erro", evt)
}
/**
 * 播放错误动画 
 * 、、、、、、、、、、、、、、、、、、、、、、、、、、
 * */
Template2.playMissedMc = function (state) {
    if (!state) {
        console.log("无动画状态");
        return;
    }
    this.tempCom = null;
    var tempMc = null;
    var wrongMc = null;
    //this.onHideAnswer();
    this.onHideOneAnswer(state);
    this.onHideWrongAnser(true);
    if (this.answerUIWrongArr.length > 0) {
        //console.log("播放点击后错误动画", state);
        if (!state) {
            //console.log("无动画状态");
            return;
        }
        //var num = state.replace(/[^0-9]/ig, "");
        this.tempCom = null;
        var tempMc = null;
        for (var k in this.answerUIWrongArr) {

            this.answerUIWrongArr[k].gotoAndStop(0);
            if (this.answerUIWrongArr[k].name == state) {
                tempMc = this.answerUIWrongArr[k];
                //break;
            }
            else {
                this.answerUIWrongArr[k].visible = false;
            }
        }

        if (!tempMc) return;
        utile.toShow(tempMc);
        //添加播放完成事件
        utile.addPlaySound("wrong",null)
        utile.addFrameEnd(tempMc, function () {
            //console.log("错误完成")
            utile.addPlaySound("try", function () {
                this.isGame = false;

            }.bind(this))
            this.onHideAnswer(true);
            this.onHideWrongAnser();
        }.bind(this));
        tempMc.play();
    }
}
/**文字声音 */
Template2.onWordSound = function (evt) {
    console.log("文字读", evt.currentTarget.name)
    //播放声音完成后
    if (evt.currentTarget.name == "word" + this.currWord) {
        this.playRightMc(this.tempCom);
    }
    //播放鼓励跳到下一个
    if (evt.currentTarget.name == "good") {
        utile.addPlaySound("next", this.onWordSound.bind(this));
        gl_level++;
        this.onStarBar();
    }
    if (evt.currentTarget.name == "next") {
        if (gl_level >= this.totallLevel) {
            //答题完成
            this.onGameWin();
        } else {

            this.isOnce = true;
            this.isGame = false;
            utile.delayTimer(1000,function(){

                this.playWord();
            }.bind(this))
        }
    };
}

/**随机答案 */
Template2.randomAnser = function () {

    var tempData = utile.randomWordByTurn(this.wordArr.length, this.totallLevel, this.answerlong, 5);
    console.log(tempData);

    for (var i = 0; i < tempData.length; i++) {
        this.answerWordArr.push(tempData[i].answer);
        this.answerList.push(tempData[i].options)
    }

}

/**设置答案 */
Template2.setAnserUI = function (_word) {
    console.log("答案组：", _word);

    for (var k in this.answerUIArr) {
        // var _text = this.wordArr[_word[k]];
        if (this.answerUIWrongArr) {
            var tempWrongMc = this.answerUIWrongArr[k];
            tempWrongMc.children[1].gotoAndStop(_word[k])

        }
        var tempMc = this.answerUIArr[k];
        tempMc.children[1].gotoAndStop(_word[k])

    }
}


/**播放正确动画 */
Template2.playRightMc = function (state) {
    //console.log("播放点击后动画", state);
    if (!state) {
        console.log("无动画状态");
        return;
    }
    var num = state.replace(/[^0-9]/ig, "");
    this.tempCom = null;
    var tempMc = null;
    this.onHideAnswer();
    this.onHideWrongAnser();
    if (this.wuya) {
        for (var k in this.stateUIArr) {
            this.stateUIArr[k].visible = true;
            var _frame = this.answerList[gl_level][k]
            this.stateUIArr[k].children[1].gotoAndStop(_frame);
            if (this.stateUIArr[k].name == "run" + num) {
                tempMc = this.stateUIArr[k];
                //break;
            }
        }
    }


    if (!tempMc) return;
    // tempMc.children[1].gotoAndStop(this.currWord)
    utile.toShow(tempMc);
    //添加播放完成事件
    utile.addFrameEnd(tempMc, this.oncePlayEndHandler.bind(this), this);
    tempMc.play();
    //播放声音
    let mp = config["options#" + state]["soundId"];
    if (mp) {
        utile.addPlaySound(mp, null);
    }
}

/**隐藏一个答案*/
Template2.onHideOneAnswer = function (value) {
    for (var j in this.answerUIArr) {
        if (this.answerUIArr[j].name == value) {
            this.answerUIArr[j].visible = false;
        }
    }
}

/**隐藏答案*/
Template2.onHideAnswer = function (value = false) {
    for (var u of this.answerUIArr) {
        u.visible = false || value;
    }
}
/**隐藏错误答案 */
Template2.onHideWrongAnser = function (value) {
    for (var j in this.answerUIWrongArr) {
        this.answerUIWrongArr[j].visible = false || value;
    }
}

/**动画完成 */
Template2.oncePlayEndHandler = function (evt) {
    console.log("播放完成");
    //播放胜利
    utile.addPlaySound("good", this.onWordSound.bind(this));
}


/**隐藏错误答案 */
Template2.onHideWrongAnser = function (value) {
    for (var j in this.answerUIWrongArr) {
        this.answerUIWrongArr[j].visible = false || value;
    }
}

/**星条进度 */
Template2.onStarBar = function () {
    gl_starBar["star" + gl_level].gotoAndStop(1);
}

/**胜利鼓励 */
Template2.onGameWin = function () {
    // this.clearAll();
    // utile.addPlaySound("goodmin", function () {
    //     utile.addFrameEnd(gl_starBar["finishEffect"], function () {
    //         gl_starBar["bigStar"].gotoAndStop(1);
    //         createjs.Tween.get(gl_gameWin).wait(500).call(() => {
    //             utile.toShow(gl_gameWin);
    //             utile.addPlaySound("gamewin");
    //             gl_gameWin.mc.gotoAndPlay(0);
    //         })
    //         // utile.addFrameEnd(gl_gameWin, function () {
    //         // 	//console.log("再玩一次")
    //         // }, true)

    //     })
    // })
    // gl_starBar["finishEffect"].play();
    this.clearAll();
    game.onWin();
}

/**清除 */
Template2.clearAll = function () {
    Template2.reEvent();
    Template2.stateUIArr = []
    Template2.answerUIArr = [];
    Template2.answerList = [];
    Template2.answerWordArr = [];
    Template2.wordArr = [];
    Template2.soundArr = [];
    Template2.tempCom = null;
    Template2.showTipic = null;
    Template2.currWord = null;
    Template2.currText = null;
    Template2.isOnce = true;
    Template2.isFirst = true;
}
