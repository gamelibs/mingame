var utile = utile || {};

/**
 * 查找影片剪辑
 * @param {Object} mc - 要搜索的容器对象
 * @param {string} name - 要查找的元件名称
 * @returns {Object|null} 找到的元件或null
 */
utile.findMc = function (mc, name) {
    if (!mc || !name) {
        console.warn('⚠️ findMc: 参数无效', { mc: !!mc, name });
        return null;
    }

    // console.log(`🔍 在容器中查找元件: ${name}`);

    // 检查当前元件本身
    if (mc.name === name) {
        // console.log(`✅ 找到目标元件 (自身): ${name}`);
        return mc;
    }

    // 方法1: 直接通过名称查找
    if (mc.getChildByName) {
        const found = mc.getChildByName(name);
        if (found) {
            // console.log(`✅ 通过 getChildByName 找到元件: ${name}`);
            return found;
        }
    }

    // 方法2: 遍历查找名称匹配的元件
    if (mc.children && mc.children.length > 0) {
        for (let child of mc.children) {
            const childName = child.name || '';
            if (childName === name) {
                // console.log(`✅ 通过遍历找到元件: ${name}`);
                return child;
            }
        }
    }

    // 方法3: 检查构造函数名称
    if (mc.children && mc.children.length > 0) {
        for (let child of mc.children) {
            const constructorName = child.constructor.name || '';
            if (constructorName.toLowerCase().includes(name.toLowerCase()) ||
                constructorName === name) {
                // console.log(`✅ 通过构造函数名找到元件: ${name} (构造函数: ${constructorName})`);
                return child;
            }
        }
    }

    // 方法4: 递归查找子元件
    if (mc.children && mc.children.length > 0) {
        for (let child of mc.children) {
            const found = utile.findMc(child, name);
            if (found) {
                // console.log(`✅ 通过递归查找找到元件: ${name}`);
                return found;
            }
        }
    }

    console.log(`❌ 未找到元件: ${name}`);
    return null;
}

/**
 * 打印可用的子元件名称（用于调试）
 * @param {Object} mc - 要检查的容器对象
 */
utile.logAvailableChildren = function (mc) {
    console.log('🔍 可用的子元件列表:');
    if (mc && mc.children) {
        mc.children.forEach((child, index) => {
            const name = child.name || 'unnamed';
            const constructor = child.constructor.name || 'unknown';
            console.log(`  ${index}: name="${name}", constructor="${constructor}"`);

            // 特别标记包含特定关键词的元件
            if (name.includes('guide') || constructor.includes('guide') ||
                name.includes('egg') || constructor.includes('egg')) {
                console.log(`    🎯 这可能是目标元件！`);
            }
        });
    } else {
        console.log('  ❌ 容器为空或没有子元件');
    }
}


/**
 * 默认不可见不绘制
 * 使影片剪辑停止播放
 */
utile.goStop = function (mc, isShow) {
    if (!mc) return;
    if (mc["visible"] == undefined) return;
    if (mc["visible"] == null) return;
    if (mc["stop"] == undefined) return;
    if (mc["stop"]) {
        mc.gotoAndStop(0);
    }
    mc.visible = isShow || false;

    if (mc["children"] && mc.children.length > 0) {
        for (var k in mc.children) {
            //if (mc.children[k]) mc.children[k].stop();
            if (mc.children[k]["children"] && mc.children[k]["children"].length > 0) {
                utile.goStop(mc.children[k], isShow);
            }
        }
    }
}

utile.goPlay = function (mc) {
    if (mc["visible"] != null || mc["visible"] != undefined) {

        mc.visible = true;
        mc.play();
    };
    if (mc["parent"] && mc["parent"]["play"]) {
        utile.goPlay(mc["parent"]);
    }
}
/**
 * 
 * @param {显示} mc 
 */
utile.toShow = function (mc) {

    function downShow(mc) {
        if (!mc) return;
        if (mc["visible"] == undefined) return;
        if (mc["visible"] == null) return
        mc.visible = true;

        if (mc["children"] && mc.children.length > 0) {
            for (var k in mc.children) {
                if (mc.children[k]["children"] && mc.children[k]["children"].length > 0) {
                    downShow(mc.children[k])
                }
            }
        }
    }
    downShow(mc);

    function upShow(mc) {
        if (!mc) return;
        if (mc["visible"] == undefined) return;
        if (mc["visible"] == null) return
        mc.visible = true;
        mc.visible = true;

        if (mc["parent"] && mc["parent"]["play"]) {
            upShow(mc["parent"]);
        }
    }

    upShow(mc);
}

/**
 * 从字库中随机文字
 * long指定范围
 * range取出范围
 */
utile.randomWord = function (long, range) {
    var tempArr = [];
    for (var k = 0; k < long; k++) {
        tempArr.push(k);
    }
    var arr = [];
    for (var j = 0; j < range; j++) {
        var len = tempArr.length;
        var n = Math.floor(Math.random() * len);
        arr.push(tempArr.splice(n, 1)[0]);
    }
    return arr;
}

/**
 * 正确答案只有一个的情况,随机出每轮5关的出题数组
 * @param {long} 指定范围
 * @param {totalLevel} 每轮关数
 * @param {answerLength} 选项个数（每轮的关数）
 * @param {maxTurn} 最大轮数
 * @returns 
 */
var turnArr = [];
var turnIndex = 0;
utile.randomWordByTurn = function (long, totalLevel, answerLength, maxTurn) {
    var result = [];

    turnIndex++;

    if (turnIndex > maxTurn) {
        turnIndex = 1;
    }

    var startIndex = (turnIndex - 1) * totalLevel;
    if (startIndex > (long - 1)) {
        turnIndex = 1;
    }

    if (turnIndex == 1) {
        turnArr = utile.randomWord(long, long);
    }

    var endIndex = turnIndex * totalLevel;
    if (endIndex > turnArr.length) {
        endIndex = turnArr.length;
    }



    var tempList = [];
    for (var i = startIndex; i < endIndex; i++) {
        tempList.push(turnArr[i]);
    }

    if (tempList.length < totalLevel) {
        var tempArr = utile.copyAry(turnArr).slice(0, startIndex - 1);
        tempArr = utile.getRandomByNum(tempArr, totalLevel - tempList.length);
        tempList = tempList.concat(tempArr);
    }

    for (var j = 0; j < tempList.length; j++) {
        var tObj = {};
        tObj.answer = tempList[j];
        var tOptions = utile.getRanNumWithout(turnArr, answerLength - 1, tObj.answer).concat([tObj.answer]);
        utile.randomArray(tOptions)
        tObj.options = tOptions;
        result.push(tObj);
    }



    return result;
}

utile.randomWordByTurnNoAnswer = function (long, totalLevel, maxTurn) {
    var result = [];

    turnIndex++;

    if (turnIndex > maxTurn) {
        turnIndex = 1;
    }

    var startIndex = (turnIndex - 1) * totalLevel;
    if (startIndex > (long - 1)) {
        turnIndex = 1;
    }

    if (turnIndex == 1) {
        turnArr = utile.randomWord(long, long);
    }

    var endIndex = turnIndex * totalLevel;
    if (endIndex > turnArr.length) {
        endIndex = turnArr.length;
    }



    var tempList = [];
    for (var i = startIndex; i < endIndex; i++) {
        tempList.push(turnArr[i]);
    }

    if (tempList.length < totalLevel) {
        var tempArr = utile.copyAry(turnArr).slice(0, startIndex - 1);
        tempArr = utile.getRandomByNum(tempArr, totalLevel - tempList.length);
        tempList = tempList.concat(tempArr);
    }

    return tempList;
}

/**随机不重复数组 */
utile.randomArr = function (a) {
    var stack = [];
    stack.push(a);
    while (true) {
        var ok = true;
        if (stack.length >= 3) break;
        var index = Math.floor(Math.random() * 10) + 1;
        for (var k in stack) {
            if (stack[k] == index) {
                ok = false;
            };
        };
        if (ok) {
            stack.push(index);
        }
    };
    return stack;
}
/**
 * 随机范围内整数
 */
utile.randomInt = function (range) {
    return Math.floor(Math.random() * range);
}

/** 获取随机数，包含min和max */
utile.getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 获取范围内N个不重复的随机数 
 * @param num: 数量
*/
utile.getMultRandom = function (min, max, num) {
    if ((max - min) < num) return [];
    let out = [];
    for (var i = 0; i < num; ++i) {
        let result = this.getRandom(min, max);
        if (out.indexOf(result) != -1) {
            --i;
        } else {
            out.push(result);
        }
    }
    return out;
}

/** 打乱数组 */
utile.randomArray = utile.randomAry = function (value) {
    //Fisher–Yates随机算法:
    let m = value.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = value[m];
        value[m] = value[i];
        value[i] = t;
    }
}

/**监听播放完成 */
utile.addFrameEnd = function (taget, callback, tf) {
    taget.timeline.addTween(
        createjs.Tween.get(taget)
            .wait(taget.totalFrames - 1)
            .call(function () {
                if (tf) {
                    taget.gotoAndStop(taget.totalFrames - 2);
                } else {
                    taget.gotoAndStop(0)
                }
                taget.timeline.removeTween();
                taget.removeAllEventListeners();
                callback && callback(taget);
            }).wait(1)
    );
}

/**播放声音 */
utile.addPlaySound = function (name, callback) {
    var sound = createjs.Sound.play(name);
    sound.name = name;
    if (callback) {
        sound.on("complete", function (evt) {
            sound.removeAllEventListeners()
            sound = null;
            callback(evt)
        });
    }
    //sound.on("failed", this.onErrorHandler, this);
}
/**延迟 */
utile.delayTimer = function (time, callback) {
    createjs.Tween.get(stage)
        .wait(time || 1000)
        .call(function () {
            createjs.Tween.removeAllTweens();
            if (callback) callback()
        })
}

utile.get16To10 = function (num) {
    var n = -1;
    switch (num) {
        case "A":
            n = 10;
            break;
        case "B":
            n = 11;
            break;
        case "C":
            n = 12;
            break;
        case "D":
            n = 13;
            break;
        case "E":
            n = 14;
            break;
        case "F":
            n = 15;
            break;
        case "G":
            n = 16;
            break;
        default:
            n = Number(num);
            break;
    }
    return n;
}
utile.randomOK = function () {
    return Math.random() > .5 ? true : false;
}

utile.randomSortArray = function (arr) {
    var stack = [];
    while (arr.length) {
        var index = parseInt(Math.random() * arr.length);
        stack.push(arr[index]);
        arr.splice(index, 1);
    }
    return stack;
}

var whether = false;

/**
 * 生成不重复的随机数
 * from: 开始数字（包含）
 * to：结束数字（包含）
 * exclued：需要排除的数组
*/
utile.getUniqueRandom = function (from, to, exclude) {
    var tempArr = [];
    var excludeArr = exclude ? exclude : [];

    for (var i = from; i <= to; i++) {
        if (excludeArr.indexOf(i) == -1) {
            tempArr.push(i);
        }
    }

    var randomIndex = Math.floor(Math.random() * tempArr.length);

    return tempArr[randomIndex]
}

/** 随机从数组中取出count个元素 原数组不变 */
utile.getRandomByNum = function (ary, count) {
    if (!ary || ary.length == 0) return [];
    let indexs = [], out = [], i;
    for (i = 0; i < ary.length; ++i) {
        indexs.push(i);
    }
    this.randomArray(indexs);
    let length = Math.min(ary.length, count);
    for (i = 0; i < length; ++i) {
        out.push(ary[indexs[i]]);
    }
    return out;
}

utile.getRanNumWithout = function (ary, count, without) {
    let newAry = utile.copyAry(ary)
    let index = newAry.indexOf(without)
    if (index != -1) {
        newAry.splice(index, 1);
    }
    return this.getRandomByNum(newAry, count)
}

utile.copyAry = function (value) {
    let out = [];
    for (i = 0; i < value.length; ++i) {
        out[i] = value[i];
    }
    return out;
}


utile.shake = function (mc) {
    if (createjs.Tween.hasActiveTweens(mc)) {
        return;
    }

    let initx = mc.x;
    let inity = mc.y;
    createjs.Tween.get(mc)
        .to({ x: mc.x + 30 }, 30)
        .wait(50)
        .to({ x: mc.x - 30 }, 30)
        .wait(50)
        .to({ x: mc.x + 20 }, 20)
        .wait(50)
        .to({ x: mc.x - 20 }, 20)
        .wait(50)
        .to({ x: mc.x + 10 }, 10)
        .wait(50)
        .to({ x: mc.x - 10 }, 10)
        .wait(50)
        .call(() => {
            mc.x = initx;
            mc.y = inity;
            createjs.Tween.removeTweens(mc);
        })
}


utile.__sdklog = function (...args) {
    if (process.env.NODE_ENV === 'production') return; // 生产环境不输出
    const formatParam = (arg) => {
        if (typeof arg === 'string') return `'${arg}'`;
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
    };

    const params = args.map(formatParam).join(' ');

    console.log(
        `%c ***CPSDK***: ${params}`,

        'background-color: #f9f9f9; ' +
        'border: 2px solid #8e44ad; ' +
        'color: #333; ' +
        'padding: 5px 15px; ' +
        'border-radius: 5px; ' +
        'font-weight: 500; ' +
        'box-shadow: 0 0 5px rgba(142, 68, 173, 0.3);'
    );
}


utile.__sdklog2 = function (...args) {
    if (process.env.NODE_ENV === 'production') return; // 生产环境不输出
    const formatParam = (arg) => {
        if (typeof arg === 'string') return `'${arg}'`;
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
    };

    const params = args.map(formatParam).join(' ');

    console.log(
        `%c ***CPSDK***: ${params}`,
        'background: linear-gradient(to right, #8e44ad, #ba43ff); ' +
        'color: white; ' +
        'padding: 5px 15px; ' +
        'border-radius: 5px; ' +
        'font-weight: bold; ' +
        'text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);'

    );
}


utile.__sdklog3 = function (...args) {
    if (process.env.NODE_ENV === 'production') return; // 生产环境不输出
    const formatParam = (arg) => {
        if (typeof arg === 'string') return `'${arg}'`;
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
    };

    const params = args.map(formatParam).join(' ');

    console.log(
        `%c ***DOTGTAG***: ${params}`,
        'background: linear-gradient(to right,rgb(68, 173, 166),rgb(4, 170, 173)); ' +
        'color: white; ' +
        'padding: 5px 15px; ' +
        'border-radius: 5px; ' +
        'font-weight: bold; ' +
        'text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);'

    );
}

export default utile;
