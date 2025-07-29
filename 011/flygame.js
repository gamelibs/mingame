(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"flygame_atlas_1", frames: [[0,0,905,794],[0,796,607,854],[636,1950,58,58],[609,796,278,278],[0,1652,889,296],[609,1076,192,103],[0,1950,160,79],[162,1950,77,92],[241,1950,77,92],[320,1950,77,92],[399,1950,77,92],[478,1950,77,92],[557,1950,77,92],[609,1181,116,139],[609,1322,116,139]]}
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



(lib.CachedBmp_24 = function() {
	this.initialize(img.CachedBmp_24);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1746,2108);


(lib.CachedBmp_5 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(img.CachedBmp_22);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2160,3840);


(lib.Bitmap10 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap11 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap2 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap3 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap4 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap5 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap6 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap7 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap8 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.Bitmap9 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(14);
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

	this.text = new cjs.Text("1568", "bold 82px 'Alibaba PuHuiTi 3.0 115 Black'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 115;
	this.text.lineWidth = 288;
	this.text.parent = this;
	this.text.setTransform(427.95,2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_score, new cjs.Rectangle(0,0,573.9,118.8), null);


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
	this.shape.setTransform(-18.7,-41.8,0.9127,0.9085,0,0,0,0.2,0.3);

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


(lib.mc_card_draw_block = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f().s("#83320C").ss(3,1,1).p("ArdsBIW7AAQAkAAAAAiIAAW/QAAAigkAAI27AAQgkAAAAgiIAA2/QAAgiAkAAg");
	this.shape.setTransform(77.025,77);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#4C2D00").s().p("ArdMCQgkAAAAgiIAA2/QAAgiAkAAIW7AAQAkAAAAAiIAAW/QAAAigkAAg");
	this.shape_1.setTransform(77.025,77);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#7E4300").s().p("ArdMCQgkAAAAgiIAA2/QAAgiAkAAIW7AAQAkAAAAAiIAAW/QAAAigkAAg");
	this.shape_2.setTransform(77.025,76.975);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape,p:{y:77}}]}).to({state:[{t:this.shape_2},{t:this.shape,p:{y:76.975}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,157.1,157);


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
	this.text = new cjs.Text("1962", "bold 82px 'Alibaba PuHuiTi 3.0 115 Black'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 115;
	this.text.lineWidth = 275;
	this.text.parent = this;
	this.text.setTransform(403.85,2);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AlDEXQgpgLgegZQgdgagPgtQgQgtAAhEQAAhDAQgtQAPgsAegaQAegaArgKQArgKA3AAQA7AAAnALQAmANAXAZQAXAZAJAmQAJAlAAAyIgBAuIgEAYIkQARQAHAcAaANQAZANArAAIBagLIAlgKIAbgLIAABzQgVANgxALQgyALhBAAQg1gBgpgJgAkXgqQgSANgDAoICNgLQAAgZgNgPQgMgPglgBQgnAAgTAOgANJEaQgRgDgJgJQgIgKgCgRIAAhdQACgRAIgKQAJgJARgDIAxgDIAvADQARADAJAJQAJAKADARIACAvIgCAuQgDARgJAKQgJAJgRADIgvADgAIsEWQgegIgTgQQgTgSgIgdQgIgdAAgrIAAiwIg1AAIAAh4IA1AAIAAhpICcAAIAABpIBOAAIAAB4IhOAAIAAChQAAAdAIAIQAJAKAYgBIAZgBIAAB1Ig/ADQgtABgegIgABKEWIglgGIAAiAIBKARQAjAGAegBQAdABALgFQALgEAAgTIgDgPIgLgKIgXgJIhdgdQgXgKgMgNQgMgPgFgTQgFgTAAgdQAAgiAJgaQAJgbAWgRQAWgTAlgIQAlgKA3ABIBLADQAjAFAUAGIgFB0IhWgPIg8gBIgQAFIgGAHIgCALIADAJIALAHIBDASQAiAJAWALQAVAMAMAOQAMAQAEAVIAEA0QAAArgNAdQgMAcgZARQgZASgjAHQgjAGgsAAgAvQEZIAAo4IDUAAQBEAAAsAJQAsAKAaAUQAbASAKAeQALAdAAAnQAAArgSAdQgSAcgvANIAAAEQAsANAbAeQAbAeAAA4QAAAngLAfQgKAfgaAVQgZAVgsAMQgsAMhDAAgAstCYIBUgDQARgCAKgFQAKgGAEgJQAEgKAAgPIgEgaQgEgKgKgGQgKgFgQgEIhVgDgAsthAIAeAAQAuAAAUgIQAVgJAAggQAAgfgVgHQgUgJguABIgeAAgANJAGQgRgDgJgIQgIgKgCgRIAAhcQACgRAIgKQAJgJARgEIAxgDIAvADQARAEAJAJQAJAKADARIACAvIgCAtQgDARgJAKQgJAIgRADIgvAEg");
	this.shape.setTransform(97.725,59.35);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_best, new cjs.Rectangle(0,0,543.2,118.8), null);


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
	this.instance = new lib.CachedBmp_24();
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
	this.instance = new lib.CachedBmp_4();
	this.instance.setTransform(-151,-988.85,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},2).wait(10));

	// Layer_3
	this.instance_1 = new lib.CachedBmp_5();
	this.instance_1.setTransform(-227.4,-967.55,0.5,0.5);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(2).to({_off:false},0).wait(10));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-227.4,-988.8,452.5,427);


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
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#D2D2D2").s().p("AgGAWQgHgCgFgGQgEgHAAgHQgBgHAFgGQAFgGAHgCQAGgCAHACQAIADAEAFQAFAGgBAHQAAAIgEAGQgEAGgIACIgHABIgGgBg");
	this.shape.setTransform(132.975,63.0431);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_22
	this.instance = new lib.CachedBmp_23();
	this.instance.setTransform(87.8,28.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_24
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#717171").ss(5,1,1).p("AiJgsQA6BrDZgX");
	this.shape_1.setTransform(124.175,72.8519);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_25
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#717171").ss(3,1,1).p("AmRAjQgYDPClA5QClA6C4gFQC6gFBNhFQBOhGgli5Qgli4ibh1QhXgzhxgTQhvgSh1BQQiVBzgZDOg");
	this.shape_2.setTransform(103.72,49.2721);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#A3A3A4").s().p("AkEErQilg5AYjPQAZjOCVhzQB1hQBvASQBxATBXAzQCbB1AlC4QAlC5hOBGQhNBFi6AFIgdAAQioAAiYg1g");
	this.shape_3.setTransform(103.72,49.2721);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// Layer_5
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#717171").ss(3,1,1).p("ACBBdQgCAjg5gOQg5gNg1gcQg3gcgWgtQgWgvAXglQAYglAmAEQAnAEAqAkQArAkAeAxQAfAygCAjg");
	this.shape_4.setTransform(87.1434,110.5638);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#A3A3A4").s().p("ABGByQg5gNg1gcQg3gcgWgtQgWgvAXglQAYglAmAEQAnAEAqAkQArAkAeAxQAfAygCAjQgCAZgeAAQgMAAgPgEg");
	this.shape_5.setTransform(87.1434,110.5638);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	// Layer_6
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#7C7C7C").ss(5,1,1).p("AA/hbQhjALg2BPQBgBrA7gPIAahcg");
	this.shape_6.setTransform(60.025,57.8973);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#ADADAE").s().p("AhagBQA2hPBjgLIAcBaIgaBcQgIABgIAAQg2AAhVhdg");
	this.shape_7.setTransform(60.025,57.8973);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	// Layer_7
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#7C7C7C").ss(6,1,1).p("ABXhGQhbgqhSAqQAmCQA6ASIA/hFg");
	this.shape_8.setTransform(65.2,38.5687);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#ADADAE").s().p("AhWhGQBRgqBcAqIgOBdIg/BFQg6gSgmiQg");
	this.shape_9.setTransform(65.2,38.5687);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8}]}).wait(1));

	// Layer_8
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("#7C7C7C").ss(6,1,1).p("ABTgfQhMhJhYALQgGCWAzAmIBOgsg");
	this.shape_10.setTransform(76.3931,21.2525);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#ADADAE").s().p("AhRhdQBYgLBMBJIgpBSIhOAsQgzgmAGiWg");
	this.shape_11.setTransform(76.3931,21.2525);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10}]}).wait(1));

	// Layer_9
	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f().s("#7C7C7C").ss(6,1,1).p("ABUAwQgghohRgoQhKB+AbA9IBXAGg");
	this.shape_12.setTransform(93.9659,9.7);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#ADADAE").s().p("AhMBaQgbg8BKh+QBRAoAgBoIhJAxg");
	this.shape_13.setTransform(93.9659,9.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12}]}).wait(1));

	// Layer_27
	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#D2D2D2").s().p("AgrCkQgfgTgZg7QgZg6AchOQAdhPAwgbQAvgaAqAVQAqAWAABOIgBAZQgDA+gUAvQgXA4gnAbIgOAJQgOAHgNAAQgOAAgOgIg");
	this.shape_14.setTransform(94.4636,117.2793,1,1,9.7256);

	this.timeline.addTween(cjs.Tween.get(this.shape_14).wait(1));

	// Layer_10
	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#717171").s().p("AATCAQglgHgbgJQgbgKgEgYQgEgXgWhbQgVhdB5gBQB3gCg1CmQAFAZAIAGQAbAWACARQACARgZAHQgNADgRAAQgPAAgTgDg");
	this.shape_15.setTransform(76.0951,135.1808);

	this.timeline.addTween(cjs.Tween.get(this.shape_15).wait(1));

	// Layer_11
	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f().s("#717171").ss(5,1,1).p("AEZiKQhCipiAgRQh+gRiDCMQiDCMABCCQACCDBJAjQBLAjBxAqQBwAqBbhQQAcgeAHgHQCSjPhCiog");
	this.shape_16.setTransform(79.9925,105.651);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#A3A3A4").s().p("AglE4QhxgqhLgjQhJgjgCiDQgBiCCDiMQCDiMB+ARQCAARBCCpQBCCoiSDPIgjAlQg8A0hFAAQglAAglgOg");
	this.shape_17.setTransform(79.9925,105.651);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_17},{t:this.shape_16}]}).wait(1));

	// Layer_12
	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#717171").s().p("AATCNQgigIgZgJQgZgKgEgaIgZh+QgVhkBugEQBtgEguC3QAFAbAHAHQAaAXACATQACASgXAIQgNAEgQAAQgNAAgQgCg");
	this.shape_18.setTransform(89.3187,127.0424);

	this.timeline.addTween(cjs.Tween.get(this.shape_18).wait(1));

	// Layer_13
	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f().s("#666666").ss(3,1,1).p("AFohNQA9hDg8ghQg7gig5AvQg4AwjlAHQhWgNikgiQijgiBoBnQBoBmCgBPQDkBxA9gQQA+gQgDgmQgCglATg4QASg3A+hCg");
	this.shape_19.setTransform(39.0723,112.7459);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#A3A3A4").s().p("AhVBeQighPhohmQhohnCjAiQCkAiBWANQDlgHA4gwQA5gvA7AiQA8Ahg9BDQg+BCgSA3QgTA4ACAlQADAmg+AQQgHACgLAAQhIAAjHhjg");
	this.shape_20.setTransform(39.0723,112.7459);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_20},{t:this.shape_19}]}).wait(1));

	// Layer_14
	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f().s("#7C7C7C").ss(4,1,1).p("ABFAfQgfhShFgbQg2BuAZAvIBIgBg");
	this.shape_21.setTransform(43.941,95.875);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#A3A3A4").s().p("AgfhOQBFAbAfBSIg5AvIhIABQgZgvA2hug");
	this.shape_22.setTransform(43.941,95.875);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_22},{t:this.shape_21}]}).wait(1));

	// Layer_15
	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f().s("#7C7C7C").ss(4,1,1).p("AA7AnQgRhKg2ghQg7BSAQAsIA8ALg");
	this.shape_23.setTransform(31.4138,96.3);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#ADADAE").s().p("Ag3A7QgQgsA7hTQA2AiARBJIg2Aeg");
	this.shape_24.setTransform(31.4138,96.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_24},{t:this.shape_23}]}).wait(1));

	// Layer_16
	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f().s("#7C7C7C").ss(3,1,1).p("AAtAdQgNg4gqgZQgsBAANAhIAtAIg");
	this.shape_25.setTransform(7.5117,95.4);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#A3A3A4").s().p("AgpAuQgNgiAsg/QAqAZANA3IgpAXg");
	this.shape_26.setTransform(7.5117,95.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_26},{t:this.shape_25}]}).wait(1));

	// Layer_23
	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f().s("#717171").ss(3,1,1).p("ABJBUQgNATgbgMQgbgLgmgcQgmgdgIgkQgIgnAbgaQAbgZAbALQAaAMAZAjQAYAjAIAlQAIAngNASg");
	this.shape_27.setTransform(102.536,112.5535);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#A3A3A4").s().p("AAhBbQgbgLgmgcQgmgdgIgkQgIgnAbgaQAbgZAbALQAaAMAZAjQAYAjAIAlQAIAngNASQgIAMgNAAQgJAAgKgFg");
	this.shape_28.setTransform(102.536,112.5535);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_28},{t:this.shape_27}]}).wait(1));

	// Layer_17
	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f().s("#7C7C7C").ss(3,1,1).p("AA0AsQgEhCgqgmQg+A8AGApIAzAUg");
	this.shape_29.setTransform(18.8946,95.8);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#ADADAE").s().p("AgyApQgGgpA+g8QAqAnAEBCIgzAQg");
	this.shape_30.setTransform(18.8946,95.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_30},{t:this.shape_29}]}).wait(1));

	// Layer_18
	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f().s("#7C7C7C").ss(5,1,1).p("ABLgaQhEhChQAJQgGCHAtAhIBHglg");
	this.shape_31.setTransform(56.2344,89.0956);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#ADADAE").s().p("AhJhTQBQgJBEBCIgmBKIhHAlQgtghAGiHg");
	this.shape_32.setTransform(56.2344,89.0956);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_32},{t:this.shape_31}]}).wait(1));

	// Layer_19
	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f().s("#7C7C7C").ss(5,1,1).p("ABJhaQhjgDg/BHQBTB4A8gHIAkhZg");
	this.shape_33.setTransform(61.425,76.0859);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#ADADAE").s().p("AhZgWQA/hHBjADIARBcIgkBZIgHAAQg6AAhOhxg");
	this.shape_34.setTransform(61.425,76.0859);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_34},{t:this.shape_33}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-3,147.2,151.3);


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
	this.shape.setTransform(67.4776,67.4952,1.1692,1.1692);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#C85F0A").s().p("AivDdQg5gzAAhPICHAAQAEAjAOAPQAZAbBCAAQAoAAAXgLQAXgMAAgXQAAgXgTgMQgSgLh4gdQhXgWgjgfQgkggAAg8QAAhGA4gzQA3g0BlAAQBfAAA8AmQA8AnAJBeIiGAAQgCgagMgPQgWgcg0AAQgsAAgSAPQgTANAAASQAAAXAUAKQAUALB2AaQBQAUAoAkQAnAnAAA5QAABNg4AvQg5Axh2gBQh3ABg6gzg");
	this.shape_1.setTransform(67.4776,67.4952,1.1692,1.1692);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#83320C").ss(3,2,1).p("AKqreIHHEGIgBOvInCD8AnexpIAHgSIOvACIAFAMAKqreIjNmPIKXKVAq1LTIDgGeIOwgBIDTmdAKqreIAEWxAR1HXIqbKdAq3reIm2EEIKPqPAq3reIDZmLAxrHhIgPgGIABuwIAMgFAxrHhIG2DyIgC2xIVhAAAnVR1IqWqUAq1LTIVjAA");
	this.shape_2.setTransform(67.6068,67.66,0.5898,0.5898);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#C85F0A").s().p("AqvLZIViAAIjTGcIuwABgAKvrYIHHEGIgBOvInCD8gAxlHnIgQgHIABuvIAMgFIG2kEIADWxgAqyrYIDZmMIAHgRIOvABIAFAMIDNGQg");
	this.shape_3.setTransform(67.2909,67.3441,0.5898,0.5898);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FF9900").s().p("AxuHeIG2DyIgC2xIVhAAIADWxI1iAAIDgGdIOvgBIDTmcIHCj8IABuvInGkGIjOmQIKYKWIABOvIqbKdIuwABgAnixtIjYGMIm3EEg");
	this.shape_4.setTransform(67.807,67.8749,0.5898,0.5898);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2,-1.9,139,139);


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
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(-2,-1.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2,-1.9,139,139);


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
	this.shape.graphics.f("#FFFFFF").s().p("AJtEMQg+gYghhAQghhAAAh0QAAicBKhEQBJhECNAAQAqAAArAGQAsAFAaAJIAAB/QhCgYhNAAQgzAAgfAQQgfAQgOAlQgOAlAAA/QAABFAMAkQALAkAdAPQAcAPA3AAIAwgCIAAhmIhaAAIAAh4IDfAAIAAFAQgiALg1AHQg0AIgzAAQhfAAg+gZgEAjaAEdIilmUIgEAAIAAGUIiQAAIAAo4IDcAAICTF7IAEAAIAAl7ICOAAIAAI4gAabEdIAAo4ICSAAIAAI4gAXJEdIgsiCIjeAAIgsCCIiXAAIDTo4IDDAAIDRI4gAV2AlIhBjDIgKAAIhDDDICOAAgAEqEdIgsiCIjeAAIgrCCIiXAAIDRo4IDEAAIDRI4gADXAlIhCjDIgKAAIhDDDICPAAgAraEdIAAjaIjQleICqAAIBtDWIAGAAIBzjWICkAAIjRFaIAADegAxEEdIgsiCIjeAAIgsCCIiXAAIDTo4IDDAAIDRI4gAyXAlIhBjDIgKAAIhDDDICOAAgA+OEdIAAo4ICRAAIAAG6IDaAAIAAB+gEgmhAEdIAAo4IDRAAQBYAAAyATQAxAUAVArQAWArAABJQAABNgXAsQgXAtgyATQgxAUhVAAIhAAAIAAClgEgkQAAEIArAAQA6AAAWgRQAXgTAAgyQAAgygXgUQgXgTg5AAIgrAAg");
	this.shape.setTransform(291.375,69.925);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#83320C").ss(6,2,1).p("EgqZgK6MBUzAAAQDIAAAADIIAAPlQAADIjIAAMhUzAAAQjIAAAAjIIAAvlQAAjIDIAAg");
	this.shape_1.setTransform(291.35,69.9);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#D96500").s().p("EgqZAK7QjIAAAAjIIAAvlQAAjIDIAAMBUyAAAQDIAAAADIIAAPlQAADIjIAAg");
	this.shape_2.setTransform(291.35,69.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.btn_playagain, new cjs.Rectangle(-3,-3,588.7,145.8), null);


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
	this.instance = new lib.CachedBmp_3();
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

	// Layer_3
	this.instance = new lib.long0("synched",0);
	this.instance.setTransform(526.2,1149.3,0.7824,0.7824,0,0,0,72.2,72.8);

	this.instance_1 = new lib.long0("synched",0);
	this.instance_1.setTransform(305.15,956.4,0.8609,0.8609,0,0,0,72.2,72.7);

	this.instance_2 = new lib.long0("synched",0);
	this.instance_2.setTransform(745.95,956.4,0.8609,0.8609,0,0,0,72.2,72.7);

	this.instance_3 = new lib.long0("synched",0);
	this.instance_3.setTransform(745.95,1353.55,0.8609,0.8609,0,0,0,72.2,72.8);

	this.instance_4 = new lib.long0("synched",0);
	this.instance_4.setTransform(305.15,1353.55,0.8609,0.8609,0,0,0,72.2,72.8);

	this.instance_5 = new lib.long0("synched",0);
	this.instance_5.setTransform(520.5,1353.55,0.8609,0.8609,0,0,0,72.2,72.8);

	this.instance_6 = new lib.long0("synched",0);
	this.instance_6.setTransform(745.95,1154.95,0.8609,0.8609,0,0,0,72.2,72.7);

	this.instance_7 = new lib.long0("synched",0);
	this.instance_7.setTransform(520.5,956.4,0.8609,0.8609,0,0,0,72.2,72.7);

	this.instance_8 = new lib.long0("synched",0);
	this.instance_8.setTransform(305.15,1154.95,0.8609,0.8609,0,0,0,72.2,72.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	// Layer_4
	this.instance_9 = new lib.mc_card_draw_block();
	this.instance_9.setTransform(539.15,1146.5,1.3242,1.3242,0,0,0,77,77);

	this.instance_10 = new lib.mc_card_draw_block();
	this.instance_10.setTransform(539.15,1353.1,1.3242,1.3242,0,0,0,77,77);

	this.instance_11 = new lib.mc_card_draw_block();
	this.instance_11.setTransform(333.9,1353.1,1.3242,1.3242,0,0,0,77,77);

	this.instance_12 = new lib.mc_card_draw_block();
	this.instance_12.setTransform(333.9,1146.5,1.3242,1.3242,0,0,0,77,77);

	this.instance_13 = new lib.mc_card_draw_block();
	this.instance_13.setTransform(333.9,943.9,1.3242,1.3242,0,0,0,77,77);

	this.instance_14 = new lib.mc_card_draw_block();
	this.instance_14.setTransform(539.15,943.9,1.3242,1.3242,0,0,0,77,77);

	this.instance_15 = new lib.mc_card_draw_block();
	this.instance_15.setTransform(743.1,943.9,1.3242,1.3242,0,0,0,77,77);

	this.instance_16 = new lib.mc_card_draw_block();
	this.instance_16.setTransform(743.1,1146.5,1.3242,1.3242,0,0,0,77,77);

	this.instance_17 = new lib.mc_card_draw_block();
	this.instance_17.setTransform(743.1,1353.1,1.3242,1.3242,0,0,0,77,77);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9}]}).wait(1));

	// Layer_14
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#83320C").ss(3,1,1).p("EgvpgyxMBfTAAAQDIAAAADIMAAABfTQAADIjIAAMhfTAAAQjIAAAAjIMAAAhfTQAAjIDIAAg");
	this.shape.setTransform(540,1149.025);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#552800").s().p("EgvpAyyQjIAAAAjIMAAAhfTQAAjIDIAAMBfTAAAQDIAAAADIMAAABfTQAADIjIAAg");
	this.shape_1.setTransform(540,1149.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	// mc_best
	this.instance_18 = new lib.mc_best();
	this.instance_18.setTransform(298.3,1529.95,0.577,0.577,0,0,0,271.6,59.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(1));

	// mc_score
	this.instance_19 = new lib.mc_score();
	this.instance_19.setTransform(703.4,1529.7,0.577,0.577,0,0,0,287,59.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(1));

	// btn_playagain
	this.btn_playagain = new lib.btn_playagain();
	this.btn_playagain.name = "btn_playagain";
	this.btn_playagain.setTransform(495.7,1632.65,1,1,0,0,0,246.6,29.2);

	this.timeline.addTween(cjs.Tween.get(this.btn_playagain).wait(1));

	// Layer_2
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#83320C").ss(3,2,1).p("EBE+ACsIDXAAIAgykIkVAAgEBHyAQBQAbgLANgjQAOgdAFg4IAEiTIgEiVQgFg5gOgeQgNgggbgLIhIgOIhHAOQgcALgOAgQgNAegFA5IgECVIAECTQAFA4ANAdQAOAjAcALIBHAMgEAyrAP7Ij5roQBUhEAniVQAmiUAAj3QAAlrhbieQhaieiwAAIl4AAIAAfzIEJAAIAAqrIA0AAIC+KrgEAp/gI7ICDALQAcAJARAcQARAaAHAuQAHAtAABFQAACSgfA3QgfA3hSAAIg/AAgEAz7AP7IEFAAIAA1QIAJAAIDbVQIFwAAIAA/zIkCAAIAAT9IgJAAIi+z9ImQAAgAfjPrQBRgtA5h2QA3h2AdjKQAdjOAAk4QAAk6gdjLQgdjLg3h2Qg5h2hRguQhRgvhoAAQhmAAhSAvQhRAug4B2Qg3B2geDLQgeDLAAE6QAAE6AeDMQAeDKA3B2QA4B2BRAtQBSAtBmAAQBoAABRgtgAIVP7IF2AAQBsAABHgpQBIgqAphLQAqhNARhuQAQhuAAiLQAAjIgrhtQgrhuhJgwIAAgNQBNguAdhlQAdhmAAieQAAiKgRhnQgRhpgrhEQgqhGhJgkQhHgihtAAIlZAAgAbdIdQgegbgShBQgQhCgHhsQgHhtAAikQAAioAHhuQAHhvAQhAQAShCAegdQAegbAvAAQAxAAAeAbQAeAdARBCQASBAAHBvQAHBvAACnQAACkgHBtQgHBsgSBCQgRBBgeAbQgeAcgxAAQgvAAgegcgAtJP7IEGAAIAA1QIAHAAIDcVQIFvAAIAA/zIkBAAIAAT9IgIAAIi/z9ImQAAgAMejXIAAlXIAwAAQBLAAAhAcQAhAdAABuQAAByghAeQghAghLAAgA0sQYICvgbICNhDIAAyWIl7AAIAAHmICHAAIAAEoIg6ACQg+AAgmgcQgmgbgUhCQgVhEgHhrQgGhrAAifQAAiZAKhoQAKhrAXhEQAYhAAogdQAmgeA6AAQA2AAA8AVQA9AUA4AoIAAn7IgzgbIjLgpQhsAAhYA2QhXA2g/B5Qg9B8ghDIQghDLAAElQAAFAAgDMQAgDLA8BzQA9B1BXArQBXAsBwAAgEgwzAETQBUhEAmiVQAniUAAj3QAAlrhbieQhaieixAAIl4AAIAAfzIEJAAIAAqrIA1AAIC9KrIJDAAIBBmsIFbAAIBAGsIEZAAIlR/zIllAAIlQfegAMeIuIAAlxICJALQAbALAQAVQAPAVAHAkIAGBaQAAA2gGAjQgHAkgPATQgQAUgcAIgEg1ngI7ICEALQAbAJASAcQARAaAGAuQAHAtAABFQAACSgeA3QggA3hSAAIg/AAgEgmqAB5IBgp8IAQAAIBfJ8gEhI0gP4IAAfzIFjAAQBoAABUgwQBTgyA7h1QA8hzAfjGQAgjCAAknQAAk9ggjIQgfjIg8huQg7hwhTgoQhUgnhoAAgEhEqAIIIAAwaIBJAAQA3AAAmAXQAlAYAXA8QAXA6AJBnQAJBrAACdQAACXgIBkQgJBkgWA7QgWA9gmAYQgmAXg5AAg");
	this.shape_2.setTransform(540.45,219);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AZzPrQhSgtg4h2Qg3h2gejKQgdjMAAk6QAAk6AdjKQAejLA3h2QA4h2BSgvQBRguBmgBQBoABBRAuQBRAvA4B2QA4B2AdDLQAeDKAAE6QAAE4geDOQgdDKg4B2Qg4B2hRAtQhRAshoAAQhmAAhRgsgAbdoiQgeAdgSBCQgQBBgHBuQgHBvAACnQAACkAHBtQAHBsAQBCQASBCAeAaQAeAcAvAAQAxAAAegcQAdgaAShCQAThCAGhsQAHhtAAikQAAingHhvQgGhugThBQgShCgdgdQgegbgxAAQgvAAgeAbgA3zPrQhXgqg8h1Qg9h0ggjLQggjLAAlAQAAklAijLQAhjIA8h7QA/h6BYg2QBXg2BtAAIDKApIA0AcIAAH6Qg5gng9gVQg8gVg2gBQg6AAgmAgQgnAcgZBAQgXBEgKBrQgKBpAACYQAACfAGBrQAIBrAUBEQAUBCAmAbQAnAdA9AAIA6gDIAAkoIiHAAIAAnmIF7AAIAASXIiNBCIivAaQhwABhXgtgEBFjAQBQgcgMgOghQgNgegFg5IgEiSIAEiVQAFg5ANgeQAOggAcgLIBHgOIBIAOQAbALANAgQAOAeAEA5IAFCVIgFCSQgEA5gOAeQgNAhgbAMIhIAMgEA7kAP7Ijb1QIgIAAIAAVQIkGAAIAA/zIGQAAIC+T9IAJAAIAAz9IECAAIAAfzgEAtxAP7Ii+qrIg0AAIAAKrIkJAAIAA/zIF3AAQCxAABbCeQBbCegBFrQABD4gnCTQgnCVhUBEID5LogEAp/gBQIA/AAQBSgBAfg3QAfg3AAiSQAAhFgHgtQgHgugRgZQgRgdgbgJIiEgLgAIVP7IAA/zIFZAAQBtAABHAiQBJAkArBGQArBEAQBpQARBoAACJQAACegdBlQgdBnhNAtIAAANQBJAwArBuQArBtAADIQAACLgRBuQgQBvgqBLQgqBNhHApQhHAphsAAgAMeIuICIgHQAcgIAPgUQARgTAGgkQAHgjgBg1IgGhaQgGgkgRgWQgPgVgbgLIiJgLgAMejXIAxAAQBKAAAhggQAhgdAAhzQAAhughgcQghgdhKAAIgxAAgAlgP7Ijb1QIgIAAIAAVQIkGAAIAA/zIGQAAIC/T9IAJAAIAAz9IEAAAIAAfzgEghWAP7IhAmtIlbAAIhBGtIpDAAIi9qrIg1AAIAAKrIkIAAIAA/zIF3AAQCxAABaCeQBbCeAAFrQAAD4gnCTQgmCVhUBEIDwLTIFQ/eIFlAAIFSfzgEgjbAB5Ihfp7IgQAAIhfJ7IDOAAgEg1ngBQIA/AAQBSgBAgg3QAfg3gBiSQABhFgIgtQgGgugRgZQgSgdgbgJIiEgLgEhIzAP7IAA/zIFiAAQBoAABUAnQBUApA7BvQA7BuAgDJQAfDHAAE9QAAEngfDBQggDHg7BzQg7B2hUAyQhUAvhoAAgEhEqAIIIBJAAQA6AAAlgXQAmgYAWg9QAWg7AJhjQAJhkAAiYQAAidgKhqQgIhogYg6QgXg8gkgYQgmgWg4AAIhJAAgEBE+ACsIgeykIEUAAIgeSkg");
	this.shape_3.setTransform(540.45,219);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).wait(1));

	// longcols
	this.instance_20 = new lib.longcols();
	this.instance_20.setTransform(540.8,497.55,0.8925,0.8925,0,0,0,435.1,514.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(1));

	// Layer_13
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#949494").ss(10,1,1).p("EhLQiM5MCWhAAAQDsAAAAGKMAAAENgQAAGJjsAAMiWhAAAQjsAAAAmJMAAAkNgQAAmKDsAAg");
	this.shape_4.setTransform(540,956.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#007144").s().p("EhLQCM6QjsAAAAmKMAAAkNfQAAmKDsAAMCWhAAAQDsAAAAGKMAAAENfQAAGKjsAAg");
	this.shape_5.setTransform(540,956.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	// Layer_1
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
	this.btnagain = new lib.btn_again();
	this.btnagain.name = "btnagain";
	this.btnagain.setTransform(568.3,1631.3,1,1,0,0,0,250,80.2);

	this.timeline.addTween(cjs.Tween.get(this.btnagain).wait(1));

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
	this.shape_2.graphics.f().s("#949494").ss(10,1,1).p("EhDBhGTMCGCAAAQDTAAAADFMAAACGdQAADFjTAAMiGCAAAQjSAAAAjFMAAAiGdQAAjFDSAAg");
	this.shape_2.setTransform(540.4517,956.1023,1.1229,2.0041);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#9C5822").s().p("EhDBBGUQjSAAAAjFMAAAiGdQAAjFDSAAMCGCAAAQDTAAAADFMAAACGdQAADFjTAAg");
	this.shape_3.setTransform(540.4517,956.1023,1.1229,2.0041);

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
	this.egg_mc7.setTransform(539.65,248.75,0.1,0.1,0,0,0,3.5,-0.5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc7).wait(1));

	// egg_mc6
	this.egg_mc6 = new lib.mc_egg6();
	this.egg_mc6.name = "egg_mc6";
	this.egg_mc6.setTransform(539.65,248.75,0.1,0.1,0,0,0,3.5,-0.5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc6).wait(1));

	// egg_mc5
	this.egg_mc5 = new lib.mc_egg5();
	this.egg_mc5.name = "egg_mc5";
	this.egg_mc5.setTransform(539.65,248.75,0.1,0.1,0,0,0,3.5,-0.5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc5).wait(1));

	// egg_mc4
	this.egg_mc4 = new lib.mc_egg4();
	this.egg_mc4.name = "egg_mc4";
	this.egg_mc4.setTransform(539.65,248.75,0.1,0.1,0,0,0,3.5,-0.5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc4).wait(1));

	// egg_mc3
	this.egg_mc3 = new lib.mc_egg3();
	this.egg_mc3.name = "egg_mc3";
	this.egg_mc3.setTransform(539.65,248.75,0.1,0.1,0,0,0,3.5,-0.5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc3).wait(1));

	// egg_mc2
	this.egg_mc2 = new lib.mc_egg2();
	this.egg_mc2.name = "egg_mc2";
	this.egg_mc2.setTransform(539.65,248.75,0.1,0.1,0,0,0,3.5,-0.5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc2).wait(1));

	// egg_mc1
	this.egg_mc1 = new lib.mc_egg1();
	this.egg_mc1.name = "egg_mc1";
	this.egg_mc1.setTransform(539.65,248.75,0.1,0.1,0,0,0,3.5,-0.5);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc1).wait(1));

	// mc_gold
	this.mc_gold = new lib.gold();
	this.mc_gold.name = "mc_gold";
	this.mc_gold.setTransform(468.85,300.9,0.8,0.8);

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
	this.instance_1 = new lib.CachedBmp_22();
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
		{src:"images/CachedBmp_24.png", id:"CachedBmp_24"},
		{src:"images/CachedBmp_22.png", id:"CachedBmp_22"},
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