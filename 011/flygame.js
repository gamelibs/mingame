(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"flygame_atlas_1", frames: [[1515,0,260,316],[0,0,904,794],[906,0,607,854],[0,1094,294,303],[296,1094,294,303],[592,1094,294,303],[888,1272,294,303],[1184,1272,294,303],[1307,856,294,303],[1515,318,248,248],[891,856,414,414],[0,796,889,296],[1515,568,192,103],[1307,1161,160,79],[1480,1302,77,92],[1480,1396,77,92],[1480,1490,77,92],[1559,1302,77,92],[1598,1161,77,92],[1603,814,77,92],[1515,673,116,139],[1480,1161,116,139]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_14 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(img.CachedBmp_13);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1746,2108);


(lib.CachedBmp_12 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(img.CachedBmp_15);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2160,3840);


(lib.Bitmap10 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap11 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap2 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap3 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap4 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap5 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap6 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap7 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap8 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap9 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.white_square = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#3F2900").s().p("AnzH0IAAvnIPnAAIAAPng");
	this.shape.setTransform(50,50);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#004F70").s().p("AnzH0IAAvnIPnAAIAAPng");
	this.shape_1.setTransform(50,50);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,100,100);


(lib.mc_score = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AJ8EbQgpgLgdgZQgdgagQgtQgPgtAAhEQAAhDAPgtQAQgsAegaQAegaArgKQArgKA3AAQA7AAAmAMQAnAMAXAaQAXAYAJAmQAJAmAAAyIgCAuIgDAXIkQARQAGAcAaANQAaANArAAIBagKIAlgLIAbgLIAABzQgVAOgxAKQgyALhBAAQg1AAgqgKgAKpgmQgTANgCAoICMgLQAAgYgMgQQgNgPglAAQgmAAgTANgAjUEbQgqgLgdgZQgQgOgMgUQgKgQgHgVQgQgtAAhEQAAhDAQgtQAHgUAKgQQAMgUAQgOQAdgaAqgKQApgKA1AAQA2AAAqAKQApAKAdAaQAcAaARAsQAPAtAABDQAABEgPAtQgRAtgcAaQgdAZgpALQgqAKg2AAQg1AAgpgKgAiWgwQgNAGgJANQgHAOgEAWIgDA4IADA4QAEAXAHANQAJAOANAGQANAFATAAQAVAAANgFQANgGAIgOQAIgNAEgXIADg4IgDg4QgEgWgIgOQgIgNgNgGQgNgGgVAAQgTAAgNAGgAptEbQgqgLgegZQgdgagQgtQgPgtAAhEQAAhDAPgtQAQgsAdgaQAegaAqgKQArgKA2AAIA9ADQAeADAXAGIAAB+IgrgLIgsgDQgYAAgTAFQgRAFgNAMQgNAMgGATQgHAUAAAfQAAAgAHAUQAGAUANALQANAMASAEQAUAFAZAAIArgDQAWgDAYgJIAAB8IgYAHIg+AJIghABQg2AAgrgKgAx5EfIhKgNIAAiMIBJAPIAqAEIBRAAQAPgDAIgFQAIgGACgIIADgWIgDgRQgCgHgJgGIgZgNIgrgNQgugKgegOQgegNgSgTQgRgUgHgaQgGgbgBgmQAAgyAQgiQAQgiAdgWQAegUApgJQApgJAzAAQA1AAAkAHIA7AOIAACCIhngRIglgCQgoAAgQAJQgRAKAAAUIACAQQADAHAJAFIBEAWQA1AOAgAQQAfARARAVQARAUAEAdQAFAdABAmQgBArgMAhQgLAhgbAYQgaAWgsANQgtAMhCAAQgwAAgqgGgARAEeQgRgDgJgJQgIgKgCgRIAAhcQACgSAIgJQAJgKARgDIAxgDIAwADQAQADAKAKQAIAJADASIACAuIgCAuQgDARgIAKQgKAJgQADIgwAEgAC5EdIAAm6ICbAAIAABNQALgaAMgRQAMgRAPgJQAPgKARgDIAlgDIAJAAIgDCKIgMAAIgnAEQgSAEgQAKQgQAJgKAPQgLAQgDAWIAADogARAALQgRgDgJgJQgIgJgCgRIAAhdQACgRAIgKQAJgJARgDIAxgEIAwAEQAQADAKAJQAIAKADARIACAvIgCAuQgDARgIAJQgKAJgQADIgwADg");
	this.shape.setTransform(122.45,60.425);

	this.text_score = new cjs.Text("1568", "bold 82px 'Alibaba PuHuiTi 3.0 115 Black'", "#FFFFFF");
	this.text_score.name = "text_score";
	this.text_score.textAlign = "center";
	this.text_score.lineHeight = 115;
	this.text_score.lineWidth = 288;
	this.text_score.parent = this;
	this.text_score.setTransform(415.15,12);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text_score},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_score, new cjs.Rectangle(0,10,561.1,118.80000000000001), null);


(lib.mc_hammer = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_14();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_hammer, new cjs.Rectangle(-0.5,-0.5,130,158), null);


(lib.mc_evil_dragon = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("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");
	this.shape.setTransform(78.9967,81.3578,0.9186,0.9186);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CA1C1C").s().p("AhoIWIAAAAIAAAAQgpgEgqgTIBTg8IAABTIAphTIAjBNIAThXIBDAuIAYhTIAnAeIAAhXIBNAHIgXARQgbAjgbAcQgfAfggAWQgrAegrALQgbAHgcAAIgVgBgAj9HXIBCgeIAABGQghgPghgZgAk8GgIAAAAIAAAAIgfggIBDgVIgkA1IA/AAIAAA3QgfgXgggggAlbGAQgTgVgTgZIBKgKIgkA4IAAAAgAm2EKIA1ADIAABFQgbghgagngAE6DeQhBg2hLgSIkhBpIEKivIAAjTIm7A6IGbipQikicjvhIQgeghgrgfQKjBqhfEhQg1C8CkCGIAAgxIA0ggQgeAmgWArIALAJQANAJgEAVIAAAmQgTgVgVgRgAGCA2IApgQIAMALIgHgBQgZAagVAbgAFugBIA9ghQAXAugXAagAEzgyQAxgzAmAMQg9g8hKgaIgKgDIAKgDQA1gSA6AAQAfAAAgAFIgnBpIAhA3Qg5gcg/AMg");
	this.shape_1.setTransform(42.7542,62.9373,0.9186,0.9186);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#4E0F01").s().p("ACEAhIgWAjQg/gZhBgKIgfguIgsAmQgkgBgkADQgbhQBOgdQAggKAdgDIAbAwIAYgtQAoAIAhAaIAgBAIAGgjIAcAXQAsA2gKAwg");
	this.shape_2.setTransform(114.8446,65.0528,0.9186,0.9186);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFCFF").s().p("AlwIzIBAgrIBNgQIAAA9IhNgtIAAA8QgjgFgdgMgAjjH4IA/gaIAABCgAAbHxIA9gZIAAAuQgfgIgegNgABYHYIAzggIBBgVIAAA/IhBgqIAQBDgAAugGIAzgbIAqgiQAZAvgPAdQgagGgagkQALAogLAaQgngJgMgegACLhDIATgzQAQAJAMAQQAPATAFAdgADkhnIAtgYQAKAkgKAXQgjgIgKgbgAERh/IAlgfQAWAqgNAaQgXgFgXgggAE2ieIARgsQAhATAJAtgAEwmeIAWgjIAnA+QgegPgfgMgABknJIAsgnIAfAuQglgGgmgBgAEJodIAmAcIgGAlgACMpCQAbgCAYAFIgYAtg");
	this.shape_3.setTransform(97.0202,109.4515,0.9186,0.9186);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("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");
	this.shape_4.setTransform(78.9967,86.5679,0.9186,0.9186);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#DF1C1C").s().p("AhwDrQg/hAAlhUQASgcA7gEQBLBDBBAQQAXBHgwAwQgnAWgiAAQgxAAgsgsgAgaDqQARAAAPgHIABAAIACgBQAcgNAIgaQgIAagcANIgCABIgBAAQgPAHgRAAIAAAAIgBAAQgKAAgMgDIgBAAIgBAAQgggIgRgZQgNgRAAgSQAAgHACgIQAIgbAcgNIABAAIAAAAIABgBIAAAAQAQgGARAAIABAAIAAAAQAMAAAMADQAgAIASAYQAMASAAASQAAAHgCAIQACgIAAgHQAAgSgMgSQgSgYgggIQgMgDgMAAIAAAAIgBAAQgRAAgQAGIAAAAIgBABIAAAAIgBAAQgcANgIAbQgCAIAAAHQAAASANARQARAZAgAIIABAAIABAAQAMADAKAAIABAAIAAAAgAg+B9QgHAEgCAHIAAABQgCAHAEAGQADAHAIACQAIACAHgEQAHgEACgHIAAAAQACgHgEgHQgEgHgIgCIgFAAQgFAAgEACgADBDlQg6gpAiguQAoAAAsgWQAngPAQgUQAjBMgLBHQgnATgiAAQgkAAgegWgADaCoQAAARAPANQAQAMAWAAQAWAAAPgNQAQgNAAgSQAAASgQANQgPANgWAAQgWAAgQgMQgPgNAAgRQABgSAPgNQAQgNAWAAIABAAIABAAIAAAAIAAAAQAVAAAOAMQAPAMAAARIAAABIAAgBQAAgRgPgMQgOgMgVAAIAAAAIAAAAIgBAAIgBAAQgWAAgQANQgPANgBASIAAAAgADyCQQgFAEAAAGQAAAGAEAEQAFAEAGAAIABAAQAGAAAFgEQAEgFAAgGQABgGgFgDQgEgFgHAAIAAAAQgHAAgEAFgAjugEQgogkgXg+QgrhIAOhSQB7AZA7BdQAuAtgGAuQgmAug8AAQgQAAgQgDgABrhtQh2g6hTAcQgKhEAphHQCIA1AjB1IgBgBg");
	this.shape_5.setTransform(114.5826,25.6577,0.9186,0.9186);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_evil_dragon, new cjs.Rectangle(-1,-1,160,164.7), null);


(lib.mc_egg2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#3FC77C").s().p("AgxB8QgpgCgPgmQgPgmAVgyQAUgyAtgjQAqgjAqABQApACAPAlQAPAmgVAyQgVA0grAiQgpAignAAIgFAAg");
	this.shape.setTransform(-18.7,-41.7,0.9127,0.9085,0,0,0,0.2,0.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#33FF66").ss(1,1,1).p("AInAfQA0Eji2CvQi1CvjzADQjzACiziwQiyixA3kxQA2kxCdjDQCdjCDAABQDBABCSDPQCTDPA1Eig");
	this.shape_1.setTransform(2.9899,-0.3483);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(21,145,81,0.973)").s().p("AAmBDQg7iMhjgtIgCgDQBXAaA4A5QA5A3AtBFIgIAIQgYAYggAEIgVg3g");
	this.shape_2.setTransform(26.65,-53.575);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("rgba(32,167,96,0.996)").s().p("AhAIvQjBgDh5iLQh5iKBLkKQBLkICQiaQCPibCrACQA3AAAuAVQBjAsA7CNIAWA4QBAC0AAC7QgCDZihCKQieCFi7AAIgKAAg");
	this.shape_3.setTransform(-6.4311,-11.6214);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("rgba(18,142,80,0.992)").s().p("AmpH1QiyixA3kxQA2kxCdjDQCdjCDAABQDBABCSDPQCTDPA1EiQA0Eji2CvQi1CvjzADIgHAAQjvAAiwiugAkroGQiQCahLEJQhLEJB5CKQB5CLDBADQDBAECiiJQChiKACjYQAAi8hAi0QAfgEAZgZIAIgHQgthFg5g5Qg5g5hXgaIACAEQgugVg3AAIgDAAQiqAAiNCZg");
	this.shape_4.setTransform(2.9899,-0.3483);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_egg2, new cjs.Rectangle(-54.2,-68.8,114.5,137), null);


(lib.mc_card_container = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#83320C").ss(3,1,1).p("Au5vnIdyAAQAvAAAAAsIAAd4QAAArgvAAI9yAAQguAAAAgrIAA94QAAgsAuAAg");
	this.shape.setTransform(102,306);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#7E4300").s().p("Au4PoQgvAAAAgsIAA93QAAgsAvAAIdwAAQAwAAAAAsIAAd3QAAAsgwAAg");
	this.shape_1.setTransform(102,306);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1,p:{x:102,y:306}},{t:this.shape,p:{x:102,y:306}}]}).to({state:[{t:this.shape_1,p:{x:104,y:101}},{t:this.shape,p:{x:104,y:101}}]},1).to({state:[{t:this.shape_1,p:{x:307,y:101}},{t:this.shape,p:{x:307,y:101}}]},1).to({state:[{t:this.shape_1,p:{x:511,y:101}},{t:this.shape,p:{x:511,y:101}}]},1).to({state:[{t:this.shape_1,p:{x:511,y:306}},{t:this.shape,p:{x:511,y:306}}]},1).to({state:[{t:this.shape_1,p:{x:511,y:509}},{t:this.shape,p:{x:511,y:509}}]},1).to({state:[{t:this.shape_1,p:{x:306,y:509}},{t:this.shape,p:{x:306,y:509}}]},1).to({state:[{t:this.shape_1,p:{x:102,y:509}},{t:this.shape,p:{x:102,y:509}}]},1).wait(1));

	// Layer_1
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#83320C").ss(3,1,1).p("EAQBgu9QABgsAvAAIeYAAQAwAAAAAtIAAeeQAAAegWAKQAWAKAAAfIAAebQAAAjgcAIQASALAAAcIAAedQAAAtgwAAI+YAAQgvAAgBgsQgBAsgvAAI+YAAQguAAgBgsIAA+fQABgsAuAAIeYAAQAvAAABAsQAAgiAcgIQgSgLAAgcIAA+bQAAgfAWgKQgVgJgBgeQgBAsgvAAI+YAAQgvAAAAgtIAA+eQAAgtAvAAIeYAAQAvAAABAsIAAegAQXv2QAKgEAQAAIeYAAQAPAAALAEEgvigP2QgWgKAAgeIAA+eQAAgtAvAAIeZAAQAwAAAAAtIAAeeQAAAegXAKQAXAKAAAfIAAebQAAAfgXAKEgvigP2QAKgEAPAAIeZAAQAPAAAKAEEgviAP3QgWgKAAgfIAA+bQAAgfAWgKEgviAP3QAKgEAPAAIeZAAQAPAAAKAEQAXAKAAAeEgQAAu+QgBAsgvAAI+ZAAQgvAAAAgtIAA+dQAAgfAWgKAQTP1QAJgCALAAIeYAAQASAAAMAGAP3QfIAAef");
	this.shape_2.setTransform(306.5,304.95);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#4C2D00").s().p("EAQmAvqQguAAgBgsIAA+fQAAgiAcgIQAJgCAKgBIeZAAQASABAMAGQgMgGgSgBI+ZAAQgKABgJACQgSgLAAgcIAA+bQAAgfAWgKQgVgJgBgeIAA+gQABgrAugBIeZAAQAwABAAAsIAAeeQAAAegXAKQAXAKAAAfIAAebQAAAjgcAIQASALAAAbIAAeeQAAAtgwAAgEAvJgP6QAPgBAKAFQgKgFgPABI+ZAAQgPgBgKAFQAKgFAPABgEgPRAvqQguAAgBgsIAA+fQABgsAugBIeYAAQAvABABAsIAAefQgBAsgvAAgEgvIAvqQgwAAAAgtIAA+eQAAgeAWgKQAKgEAQgBIeYAAQAPABALAEQgLgEgPgBI+YAAQgQABgKAEQgWgKAAgfIAA+bQAAgfAWgKQAKgFAQABIeYAAQAPgBALAFQgLgFgPABI+YAAQgQgBgKAFQgWgKAAgeIAA+eQAAgsAwgBIeYAAQAwABAAAsIAAeeQAAAegWAKQAWAKAAAfIAAebQAAAfgWAKQAWAKAAAeIAAefQgBAsgvAAgAvGvxQgwAAAAgtIAA+eQAAgsAwgBIeXAAQAvABABArIAAegQgBArgvABgAQBwdg");
	this.shape_3.setTransform(306.5,304.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(8));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,616,612.9);


(lib.mc_block = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(0,0,0,0.6)").s().p("EhUXCWAMAAAkr/MCovAAAMAAAEr/g");
	this.shape.setTransform(540,960);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_block, new cjs.Rectangle(0,0,1080,1920), null);


(lib.mc_best = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text_best = new cjs.Text("1962", "bold 82px 'Alibaba PuHuiTi 3.0 115 Black'", "#FFFFFF");
	this.text_best.name = "text_best";
	this.text_best.textAlign = "center";
	this.text_best.lineHeight = 115;
	this.text_best.lineWidth = 275;
	this.text_best.parent = this;
	this.text_best.setTransform(361.85,12);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AlDEXQgpgLgegZQgdgagPgtQgQgtAAhEQAAhDAQgtQAPgsAegaQAegaArgKQArgKA3AAQA7AAAnALQAmANAXAZQAXAZAJAmQAJAlAAAyIgBAuIgEAYIkQARQAHAcAaANQAZANArAAIBagLIAlgKIAbgLIAABzQgVANgxALQgyALhBAAQg1gBgpgJgAkXgqQgSANgDAoICNgLQAAgZgNgPQgMgPglgBQgnAAgTAOgANJEaQgRgDgJgJQgIgKgCgRIAAhdQACgRAIgKQAJgJARgDIAxgDIAvADQARADAJAJQAJAKADARIACAvIgCAuQgDARgJAKQgJAJgRADIgvADgAIsEWQgegIgTgQQgTgSgIgdQgIgdAAgrIAAiwIg1AAIAAh4IA1AAIAAhpICcAAIAABpIBOAAIAAB4IhOAAIAAChQAAAdAIAIQAJAKAYgBIAZgBIAAB1Ig/ADQgtABgegIgABKEWIglgGIAAiAIBKARQAjAGAegBQAdABALgFQALgEAAgTIgDgPIgLgKIgXgJIhdgdQgXgKgMgNQgMgPgFgTQgFgTAAgdQAAgiAJgaQAJgbAWgRQAWgTAlgIQAlgKA3ABIBLADQAjAFAUAGIgFB0IhWgPIg8gBIgQAFIgGAHIgCALIADAJIALAHIBDASQAiAJAWALQAVAMAMAOQAMAQAEAVIAEA0QAAArgNAdQgMAcgZARQgZASgjAHQgjAGgsAAgAvQEZIAAo4IDUAAQBEAAAsAJQAsAKAaAUQAbASAKAeQALAdAAAnQAAArgSAdQgSAcgvANIAAAEQAsANAbAeQAbAeAAA4QAAAngLAfQgKAfgaAVQgZAVgsAMQgsAMhDAAgAstCYIBUgDQARgCAKgFQAKgGAEgJQAEgKAAgPIgEgaQgEgKgKgGQgKgFgQgEIhVgDgAsthAIAeAAQAuAAAUgIQAVgJAAggQAAgfgVgHQgUgJguABIgeAAgANJAGQgRgDgJgIQgIgKgCgRIAAhcQACgRAIgKQAJgJARgEIAxgDIAvADQARAEAJAJQAJAKADARIACAvIgCAtQgDARgJAKQgJAIgRADIgvAEg");
	this.shape.setTransform(97.725,59.35);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.text_best}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_best, new cjs.Rectangle(0,10,501.2,118.80000000000001), null);


(lib.longcols = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_13();
	this.instance.setTransform(-1.95,-1.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.longcols, new cjs.Rectangle(-1.9,-1.8,873,1054), null);


(lib.longboss = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(-151,-988.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},2).wait(10));

	// Layer_3
	this.instance_1 = new lib.CachedBmp_12();
	this.instance_1.setTransform(-226.9,-967.4,0.5,0.5);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(2).to({_off:false},0).wait(10));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-226.9,-988.8,452,427);


(lib.long5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_22
	this.instance = new lib.CachedBmp_10();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,147,151.5);


(lib.long4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_22
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,147,151.5);


(lib.long3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_22
	this.instance = new lib.CachedBmp_8();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,147,151.5);


(lib.long2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_22
	this.instance = new lib.CachedBmp_7();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,147,151.5);


(lib.long1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_6();
	this.instance.setTransform(-1.55,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,147,151.5);


(lib.long0 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_20
	this.instance = new lib.CachedBmp_5();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,147,151.5);


(lib.guide_p = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8A3300").s().p("AD7F5QgHgBgGgFQk6jtmonMQgHgHgBgJQgBgKAFgIQAEgJAJgEQAIgEAKABQKQByE0C4QAGADAEAGQADAGABAHQAkFTkTBdIgKABIgFAAgAEFE5QDQhSgWkKQkZihoxhpQF1GNEbDZg");
	this.shape.setTransform(0.019,0.0242);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F9C752").s().p("AmmkzQIyBqEZChQAWEJjRBTQkbjZl1mOg");
	this.shape_1.setTransform(2.6553,0.5875);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-50.9,-37.7,101.9,75.5);


(lib.gold = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.text = new cjs.Text("999", "82px 'Helvetica'", "#FFFFFF");
	this.text.name = "text";
	this.text.textAlign = "center";
	this.text.lineHeight = 82;
	this.text.lineWidth = 158;
	this.text.parent = this;
	this.text.setTransform(88.85,7);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	// Layer_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#8A3300").ss(8,1,1).p("ArLm0IWXAAQCuAAAACKIAAJVQAACKiuAAI2XAAQiuAAAAiKIAApVQAAiKCuAAg");
	this.shape.setTransform(88.975,43.675);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D37300").s().p("ArLG1QiuAAAAiKIAApVQAAiKCuAAIWXAAQCuAAAACKIAAJVQAACKiuAAg");
	this.shape_1.setTransform(88.975,43.675);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.gold, new cjs.Rectangle(-4,-4,186,95.4), null);


(lib.egg7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FEAC3A").s().p("AgeBLQgYgBgJgXQgKgXANgeQAMgfAbgVQAagVAZABQAZABAJAXQAJAWgMAfQgNAfgaAVQgYAUgYAAIgEAAg");
	this.shape.setTransform(-12.0917,-27.7457);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_8
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F97800").s().p("AgqF1QiBgDhRhcQhRhdAzixQAxivBghnQBfhnBzABQByAAA6CJQA6CKgBCQQgBCQhrBcQhqBah9AAIgFAAg");
	this.shape_1.setTransform(-3.7945,-7.498);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#E15D05").s().p("AANA1QgwhAguhGQA6ASAlAmQAmAlAeAuIgFAEQgTATgYABIgVgdg");
	this.shape_2.setTransform(18.25,-35.475);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_6
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#FF6600").ss(1,1,1).p("AFvAVQAkDCh6B0Qh5B1iiACQiiACh3h3Qh3h1AljMQAkjKBpiCQBoiCCBABQCAABBhCJQBiCKAjDCg");
	this.shape_3.setTransform(2.4967,0.0016);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#E05C01").s().p("AkbFNQh3h1AljMQAkjKBpiCQBoiCCBABQCAABBhCJQBiCKAjDCQAkDCh6B0Qh5B1iiACIgFAAQifAAh1h1g");
	this.shape_4.setTransform(2.4967,0.0016);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.egg6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFE04C").s().p("AgdBLQgZgBgJgXQgKgXANgeQANgeAbgWQAZgVAZABQAaABAIAXQAKAWgNAfQgNAfgbAVQgXAUgYAAIgDAAg");
	this.shape.setTransform(-12.1,-27.7457);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_8
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F8B508").s().p("AgqF1QiBgChRhdQhQhcAyixQAyiwBfhnQBghnByABQBzAAA6CKQA5CJAACQQgBCRhsBcQhpBZh8AAIgHAAg");
	this.shape_1.setTransform(-3.8076,-7.5222);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#F19C02").s().p("AANA1QgxhAgthGQA6ASAmAmQAmAkAdAuIgFAFQgSATgZABIgVgdg");
	this.shape_2.setTransform(18.25,-35.475);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_6
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#FF9900").ss(1,1,1).p("AFvAVQAkDCh6B0Qh5B1iiACQiiABh3h1Qh3h2AljMQAkjLBoiBQBpiCCAABQCBAABhCKQBiCKAjDCg");
	this.shape_3.setTransform(2.498,0.0008);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#F19600").s().p("AkbFOQh3h2AljMQAkjLBoiBQBpiCCAABQCBAABhCKQBiCKAjDCQAkDCh6B0Qh5B1iiACIgEAAQifAAh2h0g");
	this.shape_4.setTransform(2.498,0.0008);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.egg5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EE804D").s().p("AgdBLQgZgBgJgXQgKgXANgeQANgfAbgVQAZgVAZABQAaABAIAXQAKAWgNAfQgNAfgbAVQgXAUgYAAIgDAAg");
	this.shape.setTransform(-12.1,-27.7457);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_8
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D84312").s().p("AgqF1QiBgChRhdQhQhcAyixQAyiwBfhnQBghnByABQBzAAA6CKQA5CJAACQQgBCRhsBcQhqBZh8AAIgGAAg");
	this.shape_1.setTransform(-3.8076,-7.523);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#C93407").s().p("AANA1QgxhAgthGQA6ASAmAlQAmAmAdAtIgFAGQgSASgZABIgVgdg");
	this.shape_2.setTransform(18.25,-35.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_6
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#FF0000").ss(1,1,1).p("AFvAVQAjDCh5B0Qh5B1iiACQiiABh3h1Qh3h2AljMQAkjLBpiBQBoiCCAABQCBAABhCKQBiCKAjDCg");
	this.shape_3.setTransform(2.4893,0.0008);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#C12F08").s().p("AkbFOQh3h2AljMQAkjLBpiBQBoiCCAABQCBAABhCKQBiCKAjDCQAjDCh5B0Qh5B1iiACIgEAAQifAAh2h0g");
	this.shape_4.setTransform(2.4893,0.0008);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.egg4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF99FF").ss(1,1,1).p("AFvAVQAkDCh6B0Qh5B1iiACQiiABh3h1Qh3h2AljMQAkjLBoiBQBpiCCAABQCBAABhCKQBiCKAjDCg");
	this.shape.setTransform(2.498,0.0008);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#C73C98").s().p("AgqF1QiBgChRhdQhQhcAyixQAyiwBfhnQBghnByABQAkAAAfAOQBCAeAoBeIAOAlQArB3AAB9QgBCRhsBcQhpBZh8AAIgHAAgAhnkAQgbAWgNAeQgMAfAJAXQAJAXAZABQAZABAbgVQAagVANgfQANgggJgWQgJgXgagBIgBAAQgZAAgZAUg");
	this.shape_1.setTransform(-3.8076,-7.5222);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#B13484").s().p("AAZAsQgmhdhDgdIgBgDQA6ASAmAmQAmAkAdAuIgFAGQgRAQgUACIgPglg");
	this.shape_2.setTransform(18.25,-35.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#AD327F").s().p("AkbFOQh3h2AljMQAkjLBoiBQBpiCCAABQCBAABhCKQBiCKAjDCQAkDCh6B0Qh5B1iiACIgEAAQifAAh2h0gAjIlZQhfBmgyCxQgyCwBQBdQBRBcCBACQCAADBshcQBshcABiPQAAh+grh4QAVgCARgRIAFgFQgegugmglQgmgmg6gSIABADQgfgOgkAAIgCAAQhxAAhfBmg");
	this.shape_3.setTransform(2.498,0.0008);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#F570CE").s().p("AgdBLQgZgBgJgXQgKgXANgeQANgeAbgWQAZgVAZABQAaABAIAXQAKAWgNAfQgNAfgbAVQgXAUgYAAIgDAAg");
	this.shape_4.setTransform(-12.1,-27.7457);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.egg3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#09AFD2").s().p("AgdBLQgZgBgJgXQgKgXANgeQANgeAbgWQAZgVAZABQAaABAIAXQAKAWgNAfQgNAfgbAVQgXAUgYAAIgDAAg");
	this.shape.setTransform(-12.1,-27.7457);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_8
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#0082B4").s().p("AgqF1QiBgChQhdQhRhcAyixQAyiwBghnQBfhnByABQBzAAA6CKQA5CJAACQQgBCRhsBcQhpBZh8AAIgHAAg");
	this.shape_1.setTransform(-3.804,-7.5222);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#006CA4").s().p("AANA1QgxhAgthGQA6ASAlAmQAnAkAdAuIgFAFQgSATgZABIgVgdg");
	this.shape_2.setTransform(18.25,-35.475);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_6
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#00CCFF").ss(1,1,1).p("AFvAVQAjDCh5B0Qh5B1iiACQiiABh3h1Qh3h2AljMQAkjLBpiBQBoiCCAABQCBAABhCKQBiCKAjDCg");
	this.shape_3.setTransform(2.488,0.0008);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#006BA8").s().p("AkbFOQh3h2AljMQAkjLBpiBQBoiCCAABQCBAABhCKQBiCKAjDCQAjDCh5B0Qh5B1iiACIgEAAQifAAh2h0g");
	this.shape_4.setTransform(2.488,0.0008);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.egg1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CCCCCC").s().p("AgdBLQgZgBgJgXQgKgXANgeQANgeAbgWQAZgVAZABQAaABAIAXQAKAWgNAfQgNAfgbAVQgXAUgYAAIgDAAg");
	this.shape.setTransform(-12.1,-27.7457);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_8
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AgqF1QiBgChQhdQhRhcAyixQAyiwBghnQBfhnByABQBzAAA6CKQA5CJAACQQgBCRhsBcQhpBZh8AAIgHAAg");
	this.shape_1.setTransform(-3.804,-7.5222);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#555555").s().p("AANA1QgxhAgthGQA6ASAlAmQAnAkAdAuIgFAFQgSATgZABIgVgdg");
	this.shape_2.setTransform(18.25,-35.475);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_6
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#CCCCCC").ss(1,1,1).p("AFvAVQAjDCh5B0Qh5B1iiACQiiABh3h1Qh3h2AljMQAkjLBpiBQBoiCCAABQCBAABhCKQBiCKAjDCg");
	this.shape_3.setTransform(2.488,0.0008);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#666666").s().p("AkbFOQh3h2AljMQAkjLBpiBQBoiCCAABQCBAABhCKQBiCKAjDCQAjDCh5B0Qh5B1iiACIgEAAQifAAh2h0g");
	this.shape_4.setTransform(2.488,0.0008);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.e7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_6
	this.instance = new lib.Bitmap7();
	this.instance.setTransform(-36,-46);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.e6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_6
	this.instance = new lib.Bitmap6();
	this.instance.setTransform(-36,-46);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.e5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_6
	this.instance = new lib.Bitmap5();
	this.instance.setTransform(-36,-46);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.e4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4
	this.instance = new lib.Bitmap4();
	this.instance.setTransform(-36,-46);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.e3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_6
	this.instance = new lib.Bitmap3();
	this.instance.setTransform(-36,-46);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.e2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_3
	this.instance = new lib.Bitmap2();
	this.instance.setTransform(-36,-46);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36,-46,77,92);


(lib.btn_seting = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#83320C").ss(3,2,1).p("AgFkOQhlAAg3AzQg4AzAABGQAAA8AkAgQAjAgBXAVQB4AdASALQATAMAAAWQAAAYgXALQgXAMgoAAQhCAAgZgbQgOgPgEgjIiHAAQAABPA5AzQA6AyB3AAQB2AAA5gvQA4gwAAhMQAAg7gngmQgogkhQgUQh2gZgUgLQgUgLAAgXQAAgSATgNQASgOAsAAQA0AAAWAbQAMAPACAaICGAAQgJheg8gnQg8glhfAAg");
	this.shape.setTransform(60.0555,60.0699,1.0396,1.0392);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#C85F0A").s().p("AivDdQg5gzAAhPICHAAQAEAjAOAPQAZAbBCAAQAoAAAXgLQAXgMAAgXQAAgXgTgMQgSgLh4gdQhXgWgjgfQgkggAAg8QAAhGA4gzQA3g0BlAAQBfAAA8AmQA8AnAJBeIiGAAQgCgagMgPQgWgcg0AAQgsAAgSAPQgTANAAASQAAAXAUAKQAUALB2AaQBQAUAoAkQAnAnAAA5QAABNg4AvQg5Axh2gBQh3ABg6gzg");
	this.shape_1.setTransform(60.0555,60.0699,1.0396,1.0392);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#83320C").ss(3,2,1).p("AKqreIHHEGIgBOvInCD8AnexpIAHgSIOvACIAFAMAKqreIjNmPIKXKVAq1LTIDgGeIOwgBIDTmdAKqreIAEWxAR1HXIqbKdAq3reIm2EEIKPqPAq3reIDZmLAxrHhIgPgGIABuwIAMgFAxrHhIG2DyIgC2xIVhAAAnVR1IqWqUAq1LTIVjAA");
	this.shape_2.setTransform(60.1825,60.1805,0.5244,0.5242);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#C85F0A").s().p("AqvLZIViAAIjTGcIuwABgAKvrYIHHEGIgBOvInCD8gAxlHnIgQgHIABuvIAMgFIG2kEIADWxgAqyrYIDZmMIAHgRIOvABIAFAMIDNGQg");
	this.shape_3.setTransform(59.9016,59.8998,0.5244,0.5242);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FF9900").s().p("AxuHeIG2DyIgC2xIVhAAIADWxI1iAAIDgGdIOvgBIDTmcIHCj8IABuvInGkGIjOmQIKYKWIABOvIqbKdIuwABgAnixtIjYGMIm3EEg");
	this.shape_4.setTransform(60.3605,60.3715,0.5244,0.5242);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.9,-1.9,124,124);


(lib.btn_restart = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.CachedBmp_4();
	this.instance.setTransform(-1.95,-1.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.9,-1.9,124,124);


(lib.btn_playagain = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#9A3000").s().p("AGuD4QgrgWgXg7QgWg8AAhrQAAiRAyg+QAzg/BiAAQAdAAAeAFQAeAFASAIIAAB1QgtgVg2AAQgjAAgWAOQgVAQgKAiQgJAiAAA6QAAA/AIAiQAIAhATAOQAUAOAmABIAhgCIAAhfIg+AAIAAhvICaAAIAAEoQgXAKglAHQgkAHgjAAQhCAAgrgXgAYhEIIhyl2IgDAAIAAF2IhkAAIAAoOICZAAIBmFfIADAAIAAlfIBiAAIAAIOgASTEIIAAoOIBlAAIAAIOgAQCEIIgfh5IiZAAIgfB5IhoAAICRoOICIAAICRIOgAPIAiIgti0IgHAAIguC0IBiAAgADOEIIgeh5IiaAAIgeB5IhoAAICRoOICHAAICRIOgACVAiIgui0IgHAAIguC0IBjAAgAn5EIIAAjKIiRlEIB2AAIBMDGIAEAAIBQjGIBxAAIiRFBIAADNgAr0EIIgeh5IiaAAIgfB5IhoAAICSoOICHAAICRIOgAstAiIgui0IgHAAIguC0IBjAAgA07EIIAAoOIBkAAIAAGaICXAAIAAB0gA6rEIIAAoOICRAAQA8AAAjASQAiASAPAoQAPAoAABDQAABIgQAoQgQAqgjASQgiASg6AAIgsAAIAACZgA5GAEIAdAAQAoAAAQgQQAPgSAAgtQAAgwgPgRQgQgTgoABIgdAAg");
	this.shape.setTransform(201.775,49.75);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#83320C").ss(6,2,1).p("A9Xn6MA6vAAAQCKAAAACRIAALTQAACRiKAAMg6vAAAQiKAAAAiRIAArTQAAiRCKAAg");
	this.shape_1.setTransform(201.8,50.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#D96500").s().p("A9WH7QiLAAAAiRIAArTQAAiRCLAAMA6uAAAQCKAAAACRIAALTQAACRiKAAg");
	this.shape_2.setTransform(201.8,50.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.btn_playagain, new cjs.Rectangle(-3,-3,409.6,107.4), null);


(lib.btn_go = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_3();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.btn_go, new cjs.Rectangle(-1.5,-1.5,207,207), null);


(lib.btn_again = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_2();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.btn_again, new cjs.Rectangle(0,0,444.5,148), null);


(lib.black_squre = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#6B3E00").s().p("AnzH0IAAvnIPnAAIAAPng");
	this.shape.setTransform(50,50);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#00365E").s().p("AnzH0IAAvnIPnAAIAAPng");
	this.shape_1.setTransform(50,50);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,100,100);


(lib.mc_victory = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// long0
	this.instance = new lib.long0("synched",0);
	this.instance.setTransform(328.2,915.35,1,1,0,0,0,72.2,72.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// long1
	this.instance_1 = new lib.long1("synched",0);
	this.instance_1.setTransform(535.85,914.15,1,1,0,0,0,72.8,72.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// long2
	this.instance_2 = new lib.long2("synched",0);
	this.instance_2.setTransform(740.05,920.95,1,1,0,0,0,72.2,72.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// long3
	this.instance_3 = new lib.long3("synched",0);
	this.instance_3.setTransform(336.5,1328.35,1,1,0,0,0,72.2,72.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

	// long4
	this.instance_4 = new lib.long4("synched",0);
	this.instance_4.setTransform(540.4,1328.35,1,1,0,0,0,72.2,72.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1));

	// long5
	this.instance_5 = new lib.long5("synched",0);
	this.instance_5.setTransform(744.25,1328.35,1,1,0,0,0,72.2,72.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1));

	// mc_evil_dragon
	this.instance_6 = new lib.mc_evil_dragon();
	this.instance_6.setTransform(751.4,1131.7,1,1,0,0,0,85.9,88.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1));

	// mc_hammer
	this.instance_7 = new lib.mc_hammer();
	this.instance_7.setTransform(333.45,1121.2,0.8968,0.8968,0,0,0,64.3,78.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(1));

	// btn_go
	this.btn_go = new lib.btn_go();
	this.btn_go.name = "btn_go";
	this.btn_go.setTransform(539,1121.8,1,1,0,0,0,102,102);

	this.timeline.addTween(cjs.Tween.get(this.btn_go).wait(1));

	// mc_card_container
	this.mc_card_container = new lib.mc_card_container();
	this.mc_card_container.name = "mc_card_container";
	this.mc_card_container.setTransform(538.5,1121.7,1,1,0,0,0,306.5,304.9);

	this.timeline.addTween(cjs.Tween.get(this.mc_card_container).wait(1));

	// Layer_14
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#83320C").ss(3,1,1).p("EgvpgyxMBfTAAAQDIAAAADIMAAABfTQAADIjIAAMhfTAAAQjIAAAAjIMAAAhfTQAAjIDIAAg");
	this.shape.setTransform(540,1123.7873,1,0.9999);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#552800").s().p("EgvpAyyQjIAAAAjIMAAAhfTQAAjIDIAAMBfTAAAQDIAAAADIMAAABfTQAADIjIAAg");
	this.shape_1.setTransform(540,1123.7873,1,0.9999);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// mc_best
	this.mc_best = new lib.mc_best();
	this.mc_best.name = "mc_best";
	this.mc_best.setTransform(366.55,1515.95,0.577,0.577,0,0,0,271.6,59.5);

	this.timeline.addTween(cjs.Tween.get(this.mc_best).wait(1));

	// mc_score
	this.mc_score = new lib.mc_score();
	this.mc_score.name = "mc_score";
	this.mc_score.setTransform(730.5,1515.7,0.577,0.577,0,0,0,287,59.5);

	this.timeline.addTween(cjs.Tween.get(this.mc_score).wait(1));

	// btn_playagain
	this.btn_playagain = new lib.btn_playagain();
	this.btn_playagain.name = "btn_playagain";
	this.btn_playagain.setTransform(584.8,1645.3,1,1,0,0,0,246.6,29.2);

	this.timeline.addTween(cjs.Tween.get(this.btn_playagain).wait(1));

	// Layer_26
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#83320C").ss(3,2,1).p("EBE+ACsIDXAAIAgykIkVAAgEBHyAQBQAbgLANgjQAOgdAFg4IAEiTIgEiVQgFg5gOgeQgNgggbgLIhIgOIhHAOQgcALgOAgQgNAegFA5IgECVIAECTQAFA4ANAdQAOAjAcALIBHAMgEAyrAP7Ij5roQBUhEAniVQAmiUAAj3QAAlrhbieQhaieiwAAIl4AAIAAfzIEJAAIAAqrIA0AAIC+KrgEAp/gI7ICDALQAcAJARAcQARAaAHAuQAHAtAABFQAACSgfA3QgfA3hSAAIg/AAgEAz7AP7IEFAAIAA1QIAJAAIDbVQIFwAAIAA/zIkCAAIAAT9IgJAAIi+z9ImQAAgAfjPrQBRgtA5h2QA3h2AdjKQAdjOAAk4QAAk6gdjLQgdjLg3h2Qg5h2hRguQhRgvhoAAQhmAAhSAvQhRAug4B2Qg3B2geDLQgeDLAAE6QAAE6AeDMQAeDKA3B2QA4B2BRAtQBSAtBmAAQBoAABRgtgAIVP7IF2AAQBsAABHgpQBIgqAphLQAqhNARhuQAQhuAAiLQAAjIgrhtQgrhuhJgwIAAgNQBNguAdhlQAdhmAAieQAAiKgRhnQgRhpgrhEQgqhGhJgkQhHgihtAAIlZAAgAbdIdQgegbgShBQgQhCgHhsQgHhtAAikQAAioAHhuQAHhvAQhAQAShCAegdQAegbAvAAQAxAAAeAbQAeAdARBCQASBAAHBvQAHBvAACnQAACkgHBtQgHBsgSBCQgRBBgeAbQgeAcgxAAQgvAAgegcgAtJP7IEGAAIAA1QIAHAAIDcVQIFvAAIAA/zIkBAAIAAT9IgIAAIi/z9ImQAAgAMejXIAAlXIAwAAQBLAAAhAcQAhAdAABuQAAByghAeQghAghLAAgA0sQYICvgbICNhDIAAyWIl7AAIAAHmICHAAIAAEoIg6ACQg+AAgmgcQgmgbgUhCQgVhEgHhrQgGhrAAifQAAiZAKhoQAKhrAXhEQAYhAAogdQAmgeA6AAQA2AAA8AVQA9AUA4AoIAAn7IgzgbIjLgpQhsAAhYA2QhXA2g/B5Qg9B8ghDIQghDLAAElQAAFAAgDMQAgDLA8BzQA9B1BXArQBXAsBwAAgEgwzAETQBUhEAmiVQAniUAAj3QAAlrhbieQhaieixAAIl4AAIAAfzIEJAAIAAqrIA1AAIC9KrIJDAAIBBmsIFbAAIBAGsIEZAAIlR/zIllAAIlQfegAMeIuIAAlxICJALQAbALAQAVQAPAVAHAkIAGBaQAAA2gGAjQgHAkgPATQgQAUgcAIgEg1ngI7ICEALQAbAJASAcQARAaAGAuQAHAtAABFQAACSgeA3QggA3hSAAIg/AAgEgmqAB5IBgp8IAQAAIBfJ8gEhI0gP4IAAfzIFjAAQBoAABUgwQBTgyA7h1QA8hzAfjGQAgjCAAknQAAk9ggjIQgfjIg8huQg7hwhTgoQhUgnhoAAgEhEqAIIIAAwaIBJAAQA3AAAmAXQAlAYAXA8QAXA6AJBnQAJBrAACdQAACXgIBkQgJBkgWA7QgWA9gmAYQgmAXg5AAg");
	this.shape_2.setTransform(540.45,320.05);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AZzPrQhSgtg4h2Qg3h2gejKQgdjMAAk6QAAk6AdjKQAejLA3h2QA4h2BSgvQBRguBmgBQBoABBRAuQBRAvA4B2QA4B2AdDLQAeDKAAE6QAAE4geDOQgdDKg4B2Qg4B2hRAtQhRAshoAAQhmAAhRgsgAbdoiQgeAdgSBCQgQBBgHBuQgHBvAACnQAACkAHBtQAHBsAQBCQASBCAeAaQAeAcAvAAQAxAAAegcQAdgaAShCQAThCAGhsQAHhtAAikQAAingHhvQgGhugThBQgShCgdgdQgegbgxAAQgvAAgeAbgA3zPrQhXgqg8h1Qg9h0ggjLQggjLAAlAQAAklAijLQAhjIA8h7QA/h6BYg2QBXg2BtAAIDKApIA0AcIAAH6Qg5gng9gVQg8gVg2gBQg6AAgmAgQgnAcgZBAQgXBEgKBrQgKBpAACYQAACfAGBrQAIBrAUBEQAUBCAmAbQAnAdA9AAIA6gDIAAkoIiHAAIAAnmIF7AAIAASXIiNBCIivAaQhwABhXgtgEBFjAQBQgcgMgOghQgNgegFg5IgEiSIAEiVQAFg5ANgeQAOggAcgLIBHgOIBIAOQAbALANAgQAOAeAEA5IAFCVIgFCSQgEA5gOAeQgNAhgbAMIhIAMgEA7kAP7Ijb1QIgIAAIAAVQIkGAAIAA/zIGQAAIC+T9IAJAAIAAz9IECAAIAAfzgEAtxAP7Ii+qrIg0AAIAAKrIkJAAIAA/zIF3AAQCxAABbCeQBbCegBFrQABD4gnCTQgnCVhUBEID5LogEAp/gBQIA/AAQBSgBAfg3QAfg3AAiSQAAhFgHgtQgHgugRgZQgRgdgbgJIiEgLgAIVP7IAA/zIFZAAQBtAABHAiQBJAkArBGQArBEAQBpQARBoAACJQAACegdBlQgdBnhNAtIAAANQBJAwArBuQArBtAADIQAACLgRBuQgQBvgqBLQgqBNhHApQhHAphsAAgAMeIuICIgHQAcgIAPgUQARgTAGgkQAHgjgBg1IgGhaQgGgkgRgWQgPgVgbgLIiJgLgAMejXIAxAAQBKAAAhggQAhgdAAhzQAAhughgcQghgdhKAAIgxAAgAlgP7Ijb1QIgIAAIAAVQIkGAAIAA/zIGQAAIC/T9IAJAAIAAz9IEAAAIAAfzgEghWAP7IhAmtIlbAAIhBGtIpDAAIi9qrIg1AAIAAKrIkIAAIAA/zIF3AAQCxAABaCeQBbCeAAFrQAAD4gnCTQgmCVhUBEIDwLTIFQ/eIFlAAIFSfzgEgjbAB5Ihfp7IgQAAIhfJ7IDOAAgEg1ngBQIA/AAQBSgBAgg3QAfg3gBiSQABhFgIgtQgGgugRgZQgSgdgbgJIiEgLgEhIzAP7IAA/zIFiAAQBoAABUAnQBUApA7BvQA7BuAgDJQAfDHAAE9QAAEngfDBQggDHg7BzQg7B2hUAyQhUAvhoAAgEhEqAIIIBJAAQA6AAAlgXQAmgYAWg9QAWg7AJhjQAJhkAAiYQAAidgKhqQgIhogYg6QgXg8gkgYQgmgWg4AAIhJAAgEBE+ACsIgeykIEUAAIgeSkg");
	this.shape_3.setTransform(540.45,320.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// longcols
	this.instance_8 = new lib.longcols();
	this.instance_8.setTransform(540.8,497.55,0.8925,0.8925,0,0,0,435.1,514.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(1));

	// Layer_28
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#949494").ss(10,1,1).p("EhLQiM5MCWhAAAQDsAAAAGKMAAAENgQAAGJjsAAMiWhAAAQjsAAAAmJMAAAkNgQAAmKDsAAg");
	this.shape_4.setTransform(540,956.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#007144").s().p("EhLQCM6QjsAAAAmKMAAAkNfQAAmKDsAAMCWhAAAQDsAAAAGKMAAAENfQAAGKjsAAg");
	this.shape_5.setTransform(540,956.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	// blockLayer
	this.blockLayer = new lib.mc_block();
	this.blockLayer.name = "blockLayer";
	this.blockLayer.setTransform(540,960,1,1,0,0,0,540,960);

	this.timeline.addTween(cjs.Tween.get(this.blockLayer).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_victory, new cjs.Rectangle(0,0,1080,1920), null);


(lib.mc_map = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.black_squre("synched",0);
	this.instance.setTransform(19.8,782.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_1 = new lib.white_square("synched",0);
	this.instance_1.setTransform(769.5,782.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_2 = new lib.black_squre("synched",0);
	this.instance_2.setTransform(619.75,782.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_3 = new lib.white_square("synched",0);
	this.instance_3.setTransform(469.5,782.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_4 = new lib.black_squre("synched",0);
	this.instance_4.setTransform(319.75,782.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_5 = new lib.white_square("synched",0);
	this.instance_5.setTransform(169.45,782.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_6 = new lib.black_squre("synched",0);
	this.instance_6.setTransform(769.8,632.25,1.5,1.5002,0,0,0,1.2,0.2);

	this.instance_7 = new lib.white_square("synched",0);
	this.instance_7.setTransform(619.45,632.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_8 = new lib.black_squre("synched",0);
	this.instance_8.setTransform(469.8,632.25,1.5,1.5002,0,0,0,1.2,0.2);

	this.instance_9 = new lib.white_square("synched",0);
	this.instance_9.setTransform(319.45,632.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_10 = new lib.black_squre("synched",0);
	this.instance_10.setTransform(169.75,632.25,1.5,1.5002,0,0,0,1.2,0.2);

	this.instance_11 = new lib.white_square("synched",0);
	this.instance_11.setTransform(19.5,632.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_12 = new lib.black_squre("synched",0);
	this.instance_12.setTransform(19.8,482.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_13 = new lib.white_square("synched",0);
	this.instance_13.setTransform(769.5,482.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_14 = new lib.black_squre("synched",0);
	this.instance_14.setTransform(619.75,482.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_15 = new lib.white_square("synched",0);
	this.instance_15.setTransform(469.5,482.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_16 = new lib.black_squre("synched",0);
	this.instance_16.setTransform(319.75,482.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_17 = new lib.white_square("synched",0);
	this.instance_17.setTransform(169.45,482.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_18 = new lib.black_squre("synched",0);
	this.instance_18.setTransform(769.8,332.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_19 = new lib.white_square("synched",0);
	this.instance_19.setTransform(619.45,332.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_20 = new lib.black_squre("synched",0);
	this.instance_20.setTransform(469.8,332.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_21 = new lib.white_square("synched",0);
	this.instance_21.setTransform(319.45,332.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_22 = new lib.black_squre("synched",0);
	this.instance_22.setTransform(169.75,332.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_23 = new lib.white_square("synched",0);
	this.instance_23.setTransform(19.5,332.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_24 = new lib.black_squre("synched",0);
	this.instance_24.setTransform(19.8,182.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_25 = new lib.white_square("synched",0);
	this.instance_25.setTransform(769.5,182.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_26 = new lib.black_squre("synched",0);
	this.instance_26.setTransform(619.75,182.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_27 = new lib.white_square("synched",0);
	this.instance_27.setTransform(469.5,182.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_28 = new lib.black_squre("synched",0);
	this.instance_28.setTransform(319.75,182.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_29 = new lib.white_square("synched",0);
	this.instance_29.setTransform(169.45,182.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_30 = new lib.black_squre("synched",0);
	this.instance_30.setTransform(769.8,32.15,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_31 = new lib.white_square("synched",0);
	this.instance_31.setTransform(619.45,32.15,1.5,1.5002,0,0,0,1,0.1);

	this.instance_32 = new lib.black_squre("synched",0);
	this.instance_32.setTransform(469.8,32.15,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_33 = new lib.white_square("synched",0);
	this.instance_33.setTransform(319.45,32.15,1.5,1.5002,0,0,0,1,0.1);

	this.instance_34 = new lib.black_squre("synched",0);
	this.instance_34.setTransform(169.75,32.15,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_35 = new lib.white_square("synched",0);
	this.instance_35.setTransform(19.5,32.15,1.5,1.5002,0,0,0,1,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32},{t:this.instance_31},{t:this.instance_30},{t:this.instance_29},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	// 图层_3
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#4C2D00").ss(12,1,1).p("EhJ0hJlMCTpAAAMAAACTLMiTpAAAg");
	this.shape.setTransform(467.5,482.75);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BF6D00").s().p("EhJ0BJmMAAAiTLMCTpAAAMAAACTLg");
	this.shape_1.setTransform(467.5,482.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// 图层_2
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#534000").ss(12,1,1).p("EhJ0hLYMCTpAAAMAAACWxMiTpAAAg");
	this.shape_2.setTransform(467.5,482.7477,1,0.9762);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#2D1A00").s().p("EhJ0BLZMAAAiWxMCTpAAAMAAACWxg");
	this.shape_3.setTransform(467.5,482.7477,1,0.9762);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_map, new cjs.Rectangle(-11,5.8,957,954), null);


(lib.mc_failure = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// btnagain
	this.btn_tryagain = new lib.btn_again();
	this.btn_tryagain.name = "btn_tryagain";
	this.btn_tryagain.setTransform(568.3,1631.3,1,1,0,0,0,250,80.2);

	this.timeline.addTween(cjs.Tween.get(this.btn_tryagain).wait(1));

	// Layer_2
	this.instance = new lib.mc_best();
	this.instance.setTransform(360.3,1434.85,0.577,0.577,0,0,0,271.6,59.5);

	this.instance_1 = new lib.mc_score();
	this.instance_1.setTransform(765.4,1434.6,0.577,0.577,0,0,0,287,59.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	// Layer_8
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#6F0000").ss(3,1,1).p("EAwpgEkIn/AAIAAoIIIKAAIAAgxIAjAAIAAncIsDAAIAABIIgcAAMAAAAn5IAcAAIAAA5IMdAAIAAnhIgjAAIAAgiIokAAIAAqRIH/AAgAaUVBIDQAAMAFmgp6IjkAAIgIBIIgQAAIjadBIjY+JIjsAAIAKBIIgaAAMAFgAn5IAMAAgEA+cAVBIDzAAIAAhDQgfgygJhmIgHmvQAAkZgciIQggiMhIhKQBXhLAli5QAmi6AAi+QAAiggUh5QgUh8gihoQgph6g8hAQg8hBhugFIoEAAIAABIIglAAMAAAAn5IAlAAIAAA5IDWAAIAAwcIDjAAQAEAAAEAAQA5AQAaA7QAiBRACD1IABDvIAJDbIAOCIIAmAAgEA7xgCWIj6AAIAAqfIDXAAQBGAAAjAtQBABQAADnQAADYhCBIQgMAOgRAKQgTADgUAAgEg1OAVBICSAAIAAg5IAkAAIAA1aIgkAAIAAgMIm2AAIAAG/IDzAAQgQEHhHCkQgbA/ghAmQglAZgrAAQhwAAhYjEQhYjEAAnXQAAnTBRjpQBRjqB+AAQA8AAAzAyQBHBwAUDkIAjAAQACAQABAQIDWAAQgSlwh3j1QgXgvgagmQh5jui+AAQjoAAiNGIQiMGLAAKJQAAKECLF1QCGFxDRAAQB+AABYiKQADgFAEgFQAQgTAQgYQAkg1ArhugEgshAVBIAAg5IAgAAIgB8gICkdZIDXAAIAFg5IAWAAICr9CIgBd7IDNAAIAAg5IAYAAMAAAgn5IgYAAIAAhIIk9AAIiueSIiv9KIgYAAIgHhIIlAAAMAAAAp6gAx9VBIDuAAIgIg5IAVAAMgFxgn5IgHAAIgKhIIj4AAMgF4Ap6IDnAAIAHg5IANAAIBDntIF1AAgA32FDICAu7IB4O7gAgukkIn1AAIAAoIIImAAIAAnFIgDAAIAAhIIsDAAMAAAAp6IMcAAIAAg5IADAAIAAnKIo/AAIAAqRIH1AAIAAgCIAFAAIAAm6IgFAAgAIOK7QgBgCAAgBQhMj1AAnDQAAlmAxjmQAJglAKggQBNjqCCAAQCBAABMDsQBMDrAAGsQAAGwhMDpQhMDriBAAQh6AAhMjRgAQ3RSQCfmBAArRQAArfiflzQh3k4jhAAQjiAAh3E4QhNCzgnEHQgxEaAAGGQAAHUBJE/QAkCwA4CHQB3E5DiAAQDhAAB3k5g");
	this.shape.setTransform(540.475,328.4425,1,0.7943);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#E2E2E2").s().p("AGGRTQg4iIgkiwQhJk/AAnVQAAmEAxkaQAnkIBNiyQB3k5DiAAQDhAAB3E5QCfFyAALgQAALQifGCQh3E4jhAAQjiAAh3k4gAIFqRQgKAggJAlQgxDmAAFnQAAHCBMD1IABADQBMDRB6AAQCBAABMjrQBMjpAAmxQAAmrhMjrQhMjriBAAQiCAAhNDpgEhADAQYQiLl1AAqEQAAqJCMmKQCNmJDoAAQC+AAB5DvQAaAlAXAvQB3D2ASFvIjWAAIgDgfIgjAAQgUjlhHhwQgzgyg8ABQh+AAhRDpQhRDpAAHSQAAHYBYDFQBYDDBwAAQArAAAlgYQAhgnAbg/QBHijAQkIIjzAAIAAm/IG2AAIAAAMIAkAAIAAVbIgkAAIAAA4IiSAAIgSkZQgrBtgkA2QgQAXgQAUIgHAKQhYCJh+AAQjRAAiGlxgEA+cAVBIgFg4IgmAAIgOiJIgJjcIgBjuQgCj0gihSQgag7g5gQIgIAAIjjAAIAAQcIjWAAIAAg4IglAAMAAAgn6IAlAAIAAhHIIEAAQBuAEA8BBQA8BAApB6QAiBoAUB9QAUB5AACgQAAC9gmC6QglC5hXBMQBIBJAgCNQAcCHAAEZIAHGvQAJBnAfAxIAABDgEA33gCWID6AAQAUAAATgDQARgKAMgNQBChJAAjYQAAjnhAhQQgjgthGAAIjXAAgEAlUAVBIAAg4IgcAAMAAAgn6IAcAAIAAhHIMDAAIAAHbIgjAAIAAAxIoKAAIAAIIIH/AAIAAHRIn/AAIAAKSIIkAAIAAAhIAjAAIAAHhgAaUVBIgIg4IgMAAMgFggn6IAaAAIgKhHIDsAAIDYeIIDa9BIAQAAIAIhHIDkAAMgFmAp5gAsDVBMAAAgp5IMDAAIAABHIADAAIAAHFIomAAIAAIIIH1AAIAAAVIAFAAIAAG7IgFAAIAAABIn1AAIAAKSII/AAIAAHKIgDAAIAAA4gAx9VBIhEomIl1AAIhDHuIgNAAIgHA4IjnAAMAF4gp5ID4AAIAKBHIAHAAMAFxAn6IgVAAIAIA4gAz+FEIh4u8IiAO8ID4AAgEgjCAVBIAB97IirdDIgWAAIgFA4IjXAAIik9ZIABchIggAAIAAA4IjNAAMAAAgp5IFAAAIAHBHIAYAAICvdKICu+RIE9AAIAABHIAYAAMAAAAn6IgYAAIAAA4g");
	this.shape_1.setTransform(540.475,328.4425,1,0.7943);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_14
	this.instance_2 = new lib.longcols();
	this.instance_2.setTransform(540.9,800.3,1,1,0,0,0,435.1,514.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#949494").ss(10,1,1).p("EhDBhGSMCGCAAAQDTAAAADFMAAACGcQAADEjTAAMiGCAAAQjSAAAAjEMAAAiGcQAAjFDSAAg");
	this.shape_2.setTransform(540.4517,955.952,1.1229,2.0041);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#9C5822").s().p("EhDBBGTQjSAAAAjEMAAAiGcQAAjFDSAAMCGCAAAQDTAAAADFMAAACGcQAADEjTAAg");
	this.shape_3.setTransform(540.4517,955.952,1.1229,2.0041);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// mc_block
	this.blockLayer = new lib.mc_block();
	this.blockLayer.name = "blockLayer";
	this.blockLayer.setTransform(540,960,1,1,0,0,0,540,960);

	this.timeline.addTween(cjs.Tween.get(this.blockLayer).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_failure, new cjs.Rectangle(0,0,1080,1920), null);


(lib.mc_egg7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.egg7("synched",0);
	this.instance.setTransform(1.35,0.7,1.5,1.5,0,0,0,1.4,0.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_egg7, new cjs.Rectangle(-54.2,-68.8,114.5,137), null);


(lib.mc_egg6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.egg6("synched",0);
	this.instance.setTransform(1.35,0.7,1.5,1.5,0,0,0,1.4,0.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_egg6, new cjs.Rectangle(-54.2,-68.8,114.5,137), null);


(lib.mc_egg5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.egg5("synched",0);
	this.instance.setTransform(1.35,0.7,1.5,1.5,0,0,0,1.4,0.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_egg5, new cjs.Rectangle(-54.2,-68.8,114.5,137), null);


(lib.mc_egg4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.egg4("synched",0);
	this.instance.setTransform(1.35,0.7,1.5,1.5,0,0,0,1.4,0.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_egg4, new cjs.Rectangle(-54.2,-68.8,114.5,137), null);


(lib.mc_egg3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.egg3("synched",0);
	this.instance.setTransform(1.35,0.7,1.5,1.5,0,0,0,1.4,0.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_egg3, new cjs.Rectangle(-54.2,-68.8,114.5,137), null);


(lib.mc_egg1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.egg1("synched",0);
	this.instance.setTransform(1.35,0.7,1.5,1.5,0,0,0,1.4,0.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_egg1, new cjs.Rectangle(-54.2,-68.8,114.5,137), null);


(lib.mc_egg_mask6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Bitmap9();
	this.instance.setTransform(-55,-70);

	this.instance_1 = new lib.Bitmap8();
	this.instance_1.setTransform(-55,-70);

	this.instance_2 = new lib.Bitmap10();
	this.instance_2.setTransform(-94,-8);

	this.instance_3 = new lib.Bitmap11();
	this.instance_3.setTransform(-66,24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[]},2).wait(2));

	// e7
	this.instance_4 = new lib.e7("synched",0);
	this.instance_4.setTransform(2.5,23,1,1,0,0,0,2.5,0);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(2).to({_off:false},0).to({regY:0.1,scaleX:1.5,scaleY:1.5,x:3.75,y:0.15},6).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-94,-70,192,173);


(lib.mc_egg_mask5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_5
	this.instance = new lib.Bitmap9();
	this.instance.setTransform(-55,-70);

	this.instance_1 = new lib.Bitmap8();
	this.instance_1.setTransform(-55,-70);

	this.instance_2 = new lib.Bitmap10();
	this.instance_2.setTransform(-94,-8);

	this.instance_3 = new lib.Bitmap11();
	this.instance_3.setTransform(-66,24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[]},2).wait(2));

	// e6
	this.instance_4 = new lib.e6("synched",0);
	this.instance_4.setTransform(2.5,23,1,1,0,0,0,2.5,0);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(2).to({_off:false},0).to({scaleX:1.5,scaleY:1.5,x:3.75,y:0},6).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-94,-70,192,173);


(lib.mc_egg_mask4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_5
	this.instance = new lib.Bitmap9();
	this.instance.setTransform(-55,-70);

	this.instance_1 = new lib.Bitmap8();
	this.instance_1.setTransform(-55,-70);

	this.instance_2 = new lib.Bitmap10();
	this.instance_2.setTransform(-94,-8);

	this.instance_3 = new lib.Bitmap11();
	this.instance_3.setTransform(-66,24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[]},2).wait(2));

	// e5
	this.instance_4 = new lib.e5("synched",0);
	this.instance_4.setTransform(2.5,23,1,1,0,0,0,2.5,0);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(2).to({_off:false},0).to({regY:0.1,scaleX:1.5,scaleY:1.5,x:3.75,y:0.15},6).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-94,-70,192,173);


(lib.mc_egg_mask3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_5
	this.instance = new lib.Bitmap9();
	this.instance.setTransform(-55,-70);

	this.instance_1 = new lib.Bitmap8();
	this.instance_1.setTransform(-55,-70);

	this.instance_2 = new lib.Bitmap10();
	this.instance_2.setTransform(-94,-8);

	this.instance_3 = new lib.Bitmap11();
	this.instance_3.setTransform(-66,24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[]},2).wait(2));

	// e4
	this.instance_4 = new lib.e4("synched",0);
	this.instance_4.setTransform(2.5,23,1,1,0,0,0,2.5,0);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(2).to({_off:false},0).to({regY:0.1,scaleX:1.5,scaleY:1.5,x:3.75,y:0.15},6).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-94,-70,192,173);


(lib.mc_egg_mask2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_5
	this.instance = new lib.Bitmap9();
	this.instance.setTransform(-55,-70);

	this.instance_1 = new lib.Bitmap8();
	this.instance_1.setTransform(-55,-70);

	this.instance_2 = new lib.Bitmap10();
	this.instance_2.setTransform(-94,-8);

	this.instance_3 = new lib.Bitmap11();
	this.instance_3.setTransform(-66,24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[]},2).wait(2));

	// e3
	this.instance_4 = new lib.e3("synched",0);
	this.instance_4.setTransform(2.5,23,1,1,0,0,0,2.5,0);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(2).to({_off:false},0).to({scaleX:1.5,scaleY:1.5,x:3.75,y:0},6).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-94,-70,192,173);


(lib.mc_egg_mask1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_5
	this.instance = new lib.Bitmap9();
	this.instance.setTransform(-55,-70);

	this.instance_1 = new lib.Bitmap8();
	this.instance_1.setTransform(-55,-70);

	this.instance_2 = new lib.Bitmap10();
	this.instance_2.setTransform(-94,-8);

	this.instance_3 = new lib.Bitmap11();
	this.instance_3.setTransform(-66,24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_3}]},2).to({state:[]},2).wait(2));

	// e2
	this.eaction = new lib.e2("synched",0);
	this.eaction.name = "eaction";
	this.eaction.setTransform(2.5,23,1,1,0,0,0,2.5,0);
	this.eaction._off = true;

	this.timeline.addTween(cjs.Tween.get(this.eaction).wait(2).to({_off:false},0).to({regX:2.4,regY:0.1,scaleX:1.5,scaleY:1.5,x:3.6,y:0.15},6).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-94,-70,192,173);


(lib.guide_mc = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.guide_p("synched",0);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).to({x:29.2,y:29.2},9).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-50.9,-37.7,131.1,104.7);


(lib.gamebox = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.instance = new lib.mc_map();
	this.instance.setTransform(452.5,450.5,1,1,0,0,0,472.5,482.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(16));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-31,-26.2,957,954);


(lib.egg_colok = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.egg_mc0 = new lib.mc_egg1();
	this.egg_mc0.name = "egg_mc0";
	this.egg_mc0.setTransform(811.65,67.95,1,1,0,0,0,0.1,0.1);

	this.egg_mc0_1 = new lib.mc_egg1();
	this.egg_mc0_1.name = "egg_mc0_1";
	this.egg_mc0_1.setTransform(659.95,67.95,1,1,0,0,0,0.1,0.1);

	this.egg_mc0_2 = new lib.mc_egg1();
	this.egg_mc0_2.name = "egg_mc0_2";
	this.egg_mc0_2.setTransform(508.3,67.95,1,1,0,0,0,0.1,0.1);

	this.egg_mc0_3 = new lib.mc_egg1();
	this.egg_mc0_3.name = "egg_mc0_3";
	this.egg_mc0_3.setTransform(356.65,67.95,1,1,0,0,0,0.1,0.1);

	this.egg_mc0_4 = new lib.mc_egg1();
	this.egg_mc0_4.name = "egg_mc0_4";
	this.egg_mc0_4.setTransform(205,67.95,1,1,0,0,0,0.1,0.1);

	this.egg_mc0_5 = new lib.mc_egg_mask1();
	this.egg_mc0_5.name = "egg_mc0_5";
	this.egg_mc0_5.setTransform(53.35,67.95,1,1,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.egg_mc0_5},{t:this.egg_mc0_4},{t:this.egg_mc0_3},{t:this.egg_mc0_2},{t:this.egg_mc0_1},{t:this.egg_mc0}]},1).wait(1));

	// 图层_8
	this.egg_mc1 = new lib.mc_egg2();
	this.egg_mc1.name = "egg_mc1";
	this.egg_mc1.setTransform(53.3,67.95);

	this.egg_mc2 = new lib.mc_egg3();
	this.egg_mc2.name = "egg_mc2";
	this.egg_mc2.setTransform(204.95,67.95);

	this.egg_mc3 = new lib.mc_egg4();
	this.egg_mc3.name = "egg_mc3";
	this.egg_mc3.setTransform(356.6,67.95);

	this.egg_mc4 = new lib.mc_egg5();
	this.egg_mc4.name = "egg_mc4";
	this.egg_mc4.setTransform(508.25,67.95);

	this.egg_mc5 = new lib.mc_egg6();
	this.egg_mc5.name = "egg_mc5";
	this.egg_mc5.setTransform(659.9,67.95);

	this.egg_mc6 = new lib.mc_egg7();
	this.egg_mc6.name = "egg_mc6";
	this.egg_mc6.setTransform(811.6,67.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.egg_mc6},{t:this.egg_mc5},{t:this.egg_mc4},{t:this.egg_mc3},{t:this.egg_mc2},{t:this.egg_mc1}]},1).wait(1));

	// 图层_9
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#006C8B").ss(8,1,1).p("EhLtgPnMCXbAAAQCaAAAACxIAAZsQAACyiaAAMiXbAAAQiaAAAAiyIAA5sQAAixCaAAg");
	this.shape.setTransform(539,1373.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#00365E").s().p("EhLtAPoQiaAAAAiyIAA5rQAAiyCaAAMCXbAAAQCaAAAACyIAAZrQAACyiaAAg");
	this.shape_1.setTransform(539,1373.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_1},{t:this.shape}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.7,-2.1,1044.7,1479.3);


// stage content:
(lib.flygame = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// mc_victory
	this.mc_victory = new lib.mc_victory();
	this.mc_victory.name = "mc_victory";
	this.mc_victory.setTransform(540,960,1,1,0,0,0,540,960);

	this.timeline.addTween(cjs.Tween.get(this.mc_victory).wait(1));

	// mc_failure
	this.mc_failure = new lib.mc_failure();
	this.mc_failure.name = "mc_failure";
	this.mc_failure.setTransform(540,960,1,1,0,0,0,540,960);

	this.timeline.addTween(cjs.Tween.get(this.mc_failure).wait(1));

	// mc_egg_mask6
	this.mc_egg_mask6 = new lib.mc_egg_mask6();
	this.mc_egg_mask6.name = "mc_egg_mask6";
	this.mc_egg_mask6.setTransform(919,1404.9,1,1,0,0,0,3,-0.1);

	this.timeline.addTween(cjs.Tween.get(this.mc_egg_mask6).wait(1));

	// mc_egg_mask5
	this.mc_egg_mask5 = new lib.mc_egg_mask5();
	this.mc_egg_mask5.name = "mc_egg_mask5";
	this.mc_egg_mask5.setTransform(765,1404.9,1,1,0,0,0,3,-0.1);

	this.timeline.addTween(cjs.Tween.get(this.mc_egg_mask5).wait(1));

	// mc_egg_mask4
	this.mc_egg_mask4 = new lib.mc_egg_mask4();
	this.mc_egg_mask4.name = "mc_egg_mask4";
	this.mc_egg_mask4.setTransform(611.05,1404.9,1,1,0,0,0,3,-0.1);

	this.timeline.addTween(cjs.Tween.get(this.mc_egg_mask4).wait(1));

	// mc_egg_mask3
	this.mc_egg_mask3 = new lib.mc_egg_mask3();
	this.mc_egg_mask3.name = "mc_egg_mask3";
	this.mc_egg_mask3.setTransform(457.1,1404.9,1,1,0,0,0,3,-0.1);

	this.timeline.addTween(cjs.Tween.get(this.mc_egg_mask3).wait(1));

	// mc_egg_mask2
	this.mc_egg_mask2 = new lib.mc_egg_mask2();
	this.mc_egg_mask2.name = "mc_egg_mask2";
	this.mc_egg_mask2.setTransform(303.15,1404.9,1,1,0,0,0,3,-0.1);

	this.timeline.addTween(cjs.Tween.get(this.mc_egg_mask2).wait(1));

	// mc_egg_mask1
	this.mc_egg_mask1 = new lib.mc_egg_mask1();
	this.mc_egg_mask1.name = "mc_egg_mask1";
	this.mc_egg_mask1.setTransform(149.2,1404.9,1,1,0,0,0,3,-0.1);

	this.timeline.addTween(cjs.Tween.get(this.mc_egg_mask1).wait(1));

	// btn_seting
	this.btn_restart = new lib.btn_restart();
	this.btn_restart.name = "btn_restart";
	this.btn_restart.setTransform(127.5,169.7,1,1,0,0,0,67.5,67.5);
	new cjs.ButtonHelper(this.btn_restart, 0, 1, 1);

	this.btn_seting = new lib.btn_seting();
	this.btn_seting.name = "btn_seting";
	this.btn_seting.setTransform(939.7,169.7,1,1,0,0,0,67.5,67.5);
	new cjs.ButtonHelper(this.btn_seting, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.btn_seting},{t:this.btn_restart}]}).wait(1));

	// guide_mc
	this.guide_mc = new lib.guide_mc();
	this.guide_mc.name = "guide_mc";
	this.guide_mc.setTransform(1173.85,-2.85);

	this.timeline.addTween(cjs.Tween.get(this.guide_mc).wait(1));

	// egg_mc7
	this.egg_mc7 = new lib.mc_egg7();
	this.egg_mc7.name = "egg_mc7";
	this.egg_mc7.setTransform(539.65,268.25,0.01,0.01,0,0,0,10,5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc7).wait(1));

	// egg_mc6
	this.egg_mc6 = new lib.mc_egg6();
	this.egg_mc6.name = "egg_mc6";
	this.egg_mc6.setTransform(539.65,268.25,0.01,0.01,0,0,0,5,5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc6).wait(1));

	// egg_mc5
	this.egg_mc5 = new lib.mc_egg5();
	this.egg_mc5.name = "egg_mc5";
	this.egg_mc5.setTransform(539.65,268.25,0.01,0.01,0,0,0,5,5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc5).wait(1));

	// egg_mc4
	this.egg_mc4 = new lib.mc_egg4();
	this.egg_mc4.name = "egg_mc4";
	this.egg_mc4.setTransform(539.65,268.25,0.01,0.01,0,0,0,5,5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc4).wait(1));

	// egg_mc3
	this.egg_mc3 = new lib.mc_egg3();
	this.egg_mc3.name = "egg_mc3";
	this.egg_mc3.setTransform(539.65,268.25,0.01,0.01,0,0,0,5,5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc3).wait(1));

	// egg_mc2
	this.egg_mc2 = new lib.mc_egg2();
	this.egg_mc2.name = "egg_mc2";
	this.egg_mc2.setTransform(539.65,268.25,0.01,0.01,0,0,0,5,5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc2).wait(1));

	// egg_mc1
	this.egg_mc1 = new lib.mc_egg1();
	this.egg_mc1.name = "egg_mc1";
	this.egg_mc1.setTransform(539.65,268.25,0.01,0.01,0,0,0,5,5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc1).wait(1));

	// mc_gold
	this.mc_gold = new lib.gold();
	this.mc_gold.name = "mc_gold";
	this.mc_gold.setTransform(468.85,271.9,0.8,0.8);

	this.timeline.addTween(cjs.Tween.get(this.mc_gold).wait(1));

	// gamebox
	this.gamebox = new lib.gamebox();
	this.gamebox.name = "gamebox";
	this.gamebox.setTransform(92.5,373.85);

	this.timeline.addTween(cjs.Tween.get(this.gamebox).wait(1));

	// egg_mask
	this.instance = new lib.egg_colok();
	this.instance.setTransform(112.7,1230.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// longboss
	this.mc_longboss = new lib.longboss();
	this.mc_longboss.name = "mc_longboss";
	this.mc_longboss.setTransform(539.35,1006.85,0.9796,0.9796);

	this.timeline.addTween(cjs.Tween.get(this.mc_longboss).wait(1));

	// bg
	this.instance_1 = new lib.CachedBmp_15();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(540,960,540,960);
// library properties:
lib.properties = {
	id: '994179DFE830400BA68CFA701D2BB3AB',
	width: 1080,
	height: 1920,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_13.png", id:"CachedBmp_13"},
		{src:"images/CachedBmp_15.png", id:"CachedBmp_15"},
		{src:"images/flygame_atlas_1.png", id:"flygame_atlas_1"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['994179DFE830400BA68CFA701D2BB3AB'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;