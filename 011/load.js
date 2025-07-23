var canvas, stage, stageWidth, stageHeight, gl_mc, config = {};
var publicRoot, exportRoot, mainComp, pubComp, mainLib, pubLib, pubSound;
var load = function() {
    var loader, preload, loadedNum = 0;
};
load.prototype = {
    init: function() {
        this.loadedNum = 0;
        dom_overlay_container = document.getElementById("dom_overlay_container");
        anim_container = document.getElementById("animation_container");
        preloaderDiv = document.getElementById("_preload_div_");
        canvas = document.getElementById("canvas");

        //loading
        var comp = AdobeAn.getComposition("A7A9C8845E262747ACF5E636B003893C");
        var lib = comp.getLibrary();
        this.loader = new createjs.LoadQueue(false);
        this.loader.addEventListener("fileload", function(evt) { this.handleFileLoad(evt, comp) }.bind(this));
        this.loader.addEventListener("complete", function(evt) { this.handleComplete(evt, comp) }.bind(this));
        this.loader.loadManifest(lib.properties.manifest);

    },
    handleFileLoad: function(evt, comp) {
        var images = comp.getImages();
        if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }
    },
    handleComplete: function(evt, comp) {
        this.loader.removeAllEventListeners();
        canvas.style.display = 'block';
        // preloaderDiv.style.display = 'none';

        stage = new createjs.Stage(canvas);
        createjs.Ticker.framerate = 30;
        createjs.Ticker.addEventListener("tick", this.stageBreakHandler);



        var lib = comp.getLibrary();
        var ss = comp.getSpriteSheet();
        var queue = evt.target;
        var ssMetadata = lib.ssMetadata;
        for (i = 0; i < ssMetadata.length; i++) {
            ss[ssMetadata[i].name] = new createjs.SpriteSheet({ "images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames })
        }
        gl_mc = new lib.loading2();
        var loadMc = gl_mc["mc"];
        gl_loadBar = loadMc["loadBar"];
        gl_loadBar.gotoAndStop(0);
        stage.addChild(gl_mc);

        //加载模板文件
        this.preload = null;
        this.preload = new createjs.LoadQueue(false);
        this.preload.on("fileload", this.onFileloadHandler, this);
        this.preload.loadFile("./model/model_template.json");

    },
    onFileloadHandler: function(evt) {
        this.preload.removeAllEventListeners();
        this.goPlayFrameEnd(gl_loadBar, 1);

        var result = evt.result;
        for (var k in result) {
            if (result[k].compName) {
                config[result[k].compName] = result[k];
            }
        }

        template = mainType[config.model.attr];
        mainCode = config.gameID.attr;
        mainName = config.gameName.attr;
        mainJson = [
            { id: "utile", src: "./src/utile.js" },
            { id: "main", src: "main.js" },
            { id: "PulicComp", src: "./src/" + compName + ".js" },
            { id: "game", src: "./src/" + "game.js" },
            { id: "Template", src: "./src/template/" + "Template" + template + ".js" },
            { id: mainName, src: "./yanyu/" + mainName + ".js" },
            { id: "resdata_" + mainName, src: "./model/resdata_" + mainName + ".json" } //加载声音与图片
        ];
        this.preload = null;
        this.preload = new createjs.LoadQueue(false);
        this.preload.on("complete", this.onMainJsonHandler, this);
        this.preload.on("fileload", this.onfileMainJsonHandler, this);
        this.preload.loadManifest(mainJson);
    },
    onfileMainJsonHandler: function(evt) {
        var item = evt.item;
        var id = item.id;
        var result = evt.result;
        switch (item.type) {

            case createjs.AbstractLoader.JAVASCRIPT:
                if (id == compName) {
                    pubComp = AdobeAn.getComposition(commCode);
                    pubLib = pubComp.getLibrary();

                }
                if (id == mainName) {
                    mainComp = AdobeAn.getComposition(mainCode);
                    mainLib = mainComp.getLibrary();

                }
                break;

            case createjs.AbstractLoader.JSON:
                //加载声音与图片
                if (id == "resdata_" + mainName) {
                    soundArr = [];
                    imgArr = [];
                    for (var k in result) {
                        //查找声音
                        if (result[k].soundData) {
                            var route = ""
                            if (result[k].route) {
                                route = result[k].route;
                            }
                            var temp = { "id": result[k].soundid, "src": "sounds/" + route + result[k].soundData + ".mp3" }
                            soundArr.push(temp);
                        }
                        //查找图片
                        if (result[k].imgData) {
                            var image = ""
                            if (result[k].image) {
                                image = result[k].image;
                            }
                            var temp = { "id": result[k].imgid, "src": "images/" + image + result[k].imgData }
                            imgArr.push(temp);

                        }
                    }
                }
                break;
        }
    },
    onMainJsonHandler: function(evt) {
        this.preload.removeAllEventListeners();
        this.goPlayFrameEnd(gl_loadBar, 10);
        pubSound = [];

        createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
        createjs.Sound.alternateExtensions = ["mp3"];

        this.preload = null;
        this.preload = new createjs.LoadQueue(false);
        this.preload.installPlugin(createjs.Sound);

        createjs.Sound.muted = true;
        this.preload.on("complete", this.onSundJsonHandler, this);
        this.preload.on("fileload", this.onFileSoundJsonHandler, this);
        this.preload.loadManifest(soundArr);

    },
    onFileSoundJsonHandler: function(evt) {
        pubSound.push(evt.item.id);
    },
    onSundJsonHandler: function() {
        this.preload.removeAllEventListeners();
        this.goPlayFrameEnd(gl_loadBar, 40);
        createjs.Sound.volume = 0.8;
        this.tk(pubSound[0]);
    },
    tk: function(id) {
        var self = this;
        createjs.Sound.play(id)
        var st = setTimeout(function() {
            createjs.Sound.stop();
            self.loadedNum++;
            self.goPlayFrameEnd(gl_loadBar, 50 + self.loadedNum);
            pubSound.shift();
            if (pubSound.length == 0) {
                clearTimeout(st);
                loadedNum = 0;
                self.ontk();
            } else {
                self.tk(pubSound[0])
            }
        }, 100);

    },
    ontk: function() {
        createjs.Sound.muted = false;
        this.preload = null;
        this.preload = new createjs.LoadQueue(false);
        this.preload.on("complete", this.oncompImgJsonHandler, this);
        this.preload.on("fileload", this.onFileImgJsonHandler, this);
        this.preload.loadManifest(imgArr);
    },
    onFileImgJsonHandler: function(evt) {
        var item = evt.item;
        var id = item.id;
        var result = evt.result;

        var lib = pubComp.getLibrary();
        if (id == imgArr[0].id) {

            var images = pubComp.getImages();
            if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }

            var ss = pubComp.getSpriteSheet();
            var queue = evt.target;
            var ssMetadata = lib.ssMetadata;
            for (i = 0; i < ssMetadata.length; i++) {
                ss[ssMetadata[i].name] = new createjs.SpriteSheet({ "images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames })
            }
        }
        var main_lib = mainComp.getLibrary();
        var main_ss = mainComp.getSpriteSheet();
        var main_ssMetadata = main_lib.ssMetadata;
        for (var k in main_lib.properties.manifest) {
            var images = mainComp.getImages();

            if (id == main_lib.properties.manifest[k].id) {
                if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }

                var queue = evt.target;
                for (i = 0; i < main_ssMetadata.length; i++) { //ssMetadata.length
                    if (id == main_ssMetadata[i].name) {

                        main_ss[main_ssMetadata[i].name] = new createjs.SpriteSheet({ "images": [queue.getResult(main_ssMetadata[i].name)], "frames": main_ssMetadata[i].frames })
                    }
                }
            }
        }
    },
    oncompImgJsonHandler: function() {
        this.preload.removeAllEventListeners();
        this.goPlayFrameEnd(gl_loadBar, 100);
        var st = setTimeout(function() {
            clearTimeout(st);
            stage.removeAllChildren();
            main.init()
        }, 500);

    },
    stageBreakHandler: function() {
        if (stageWidth != document.documentElement.clientWidth || stageHeight != document.documentElement.clientHeight) {
            stageWidth = document.documentElement.clientWidth;
            stageHeight = document.documentElement.clientHeight;

            canvas.width = stageWidth;
            canvas.height = stageHeight;

            preloaderDiv.width = stageWidth;
            preloaderDiv.height = stageHeight;

            if (stageWidth < stageHeight) {
                stageScale = Math.min(stageWidth / 1080, stageHeight / 1920);
                preloaderDiv.rotation = gl_mc.rotation = 90;
                preloaderDiv.x = gl_mc.x = 1080 * stageScale + stageWidth / 2 - 1080 * stageScale / 2;
                preloaderDiv.y = gl_mc.y = stageHeight / 2 - 1920 * stageScale / 2; //居中一下
                preloaderDiv.scaleX = gl_mc.scaleX = stageScale;
                preloaderDiv.scaleY = gl_mc.scaleY = stageScale;
            } else {
                stageScale = Math.min(stageWidth / 1920, stageHeight / 1080);
                preloaderDiv.rotation = gl_mc.rotation = 0;
                preloaderDiv.x = gl_mc.x = stageWidth / 2 - 1920 * stageScale / 2;
                preloaderDiv.y = gl_mc.y = stageHeight / 2 - 1080 * stageScale / 2;
                preloaderDiv.scaleX = gl_mc.scaleX = stageScale;
                preloaderDiv.scaleY = gl_mc.scaleY = stageScale;

            }
        }
        stage.update();
    },
    goPlayFrameEnd: function(target, num) {

        target.gotoAndStop(num - 2);
    }
}

const commCode = "2E283EB2E6AA1448861CDF2DED8C4824";

const compName = "PulicComp";
// var mainType = {
//     "RZ_TF": 1, 
//     "RZ_KT": 2, 
//     "RZ_TY": 3, 
// }
var mainType = {
    "KTSZ": 2, //看图识字
    "TYSZ": 3, //听音识字
    "TYSZ_NO_WUYA": 4, //无题动画
    "TYSZ_NO": 5, //有点错动画
    "TYSZ_NO_ONE": 6, //非单一答案
    "TYRZ": 7, //听音认字
    "TZZJ": 8, //托拽
    "TYSZ_BEFOR": 9, //预览答案
}