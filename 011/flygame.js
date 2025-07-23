(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"flygame_atlas_1", frames: [[0,0,677,954],[679,0,58,58],[0,956,1270,302]]}
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



(lib.CachedBmp_4 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["flygame_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(img.CachedBmp_1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2160,3840);// helper functions:

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

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#004F70").s().p("AnzH0IAAvnIPnAAIAAPng");
	this.shape.setTransform(50,50);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,100,100);


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

	// Layer_1
	this.instance = new lib.CachedBmp_4();
	this.instance.setTransform(-169.15,-238.4,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.longboss, new cjs.Rectangle(-169.1,-238.4,338.5,477), null);


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
	this.instance = new lib.CachedBmp_3();
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


(lib.egg2 = function(mode,startPosition,loop,reversed) {
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
	this.shape.graphics.f("#3FC77C").s().p("AgxB8QgpgCgPgmQgPgmAVgyQAUgyAtgjQAqgjAqABQApACAPAlQAPAmgVAyQgVA0grAiQgpAignAAIgFAAg");
	this.shape.setTransform(-12.099,-27.7965,0.6085,0.6057);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	// Layer_8
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(32,167,96,0.996)").s().p("AgqF1QiBgChQhdQhRhcAyixQAyiwBghnQBfhnByABQBzAAA6CKQA5CJAACQQgBCRhsBcQhpBZh8AAIgHAAg");
	this.shape_1.setTransform(-3.804,-7.5222);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1));

	// Layer_3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(21,145,81,0.973)").s().p("AANA1QgxhAgthGQA6ASAlAmQAnAkAdAuIgFAFQgSATgZABIgVgdg");
	this.shape_2.setTransform(18.25,-35.475);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_6
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#33FF66").ss(1,1,1).p("AFvAVQAjDCh5B0Qh5B1iiACQiiABh3h1Qh3h2AljMQAkjLBpiBQBoiCCAABQCBAABhCKQBiCKAjDCg");
	this.shape_3.setTransform(2.488,0.0008);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("rgba(18,142,80,0.992)").s().p("AkbFOQh3h2AljMQAkjLBpiBQBoiCCAABQCBAABhCKQBiCKAjDCQAjDCh5B0Qh5B1iiACIgEAAQifAAh2h0g");
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


(lib.egg_mc_ac = function(mode,startPosition,loop,reversed) {
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
	this.instance.setTransform(-317.5,-75.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.egg_mc_ac, new cjs.Rectangle(-317.5,-75.8,635,151), null);


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

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#00365E").s().p("AnzH0IAAvnIPnAAIAAPng");
	this.shape.setTransform(50,50);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,100,100);


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
	this.instance = new lib.egg2("synched",0);
	this.instance.setTransform(1.35,0.7,1.5,1.5,0,0,0,1.4,0.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mc_egg2, new cjs.Rectangle(-54.2,-68.8,114.5,137), null);


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

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:29.2,y:29.2},9).wait(1));

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
	this.instance = new lib.black_squre("synched",0);
	this.instance.setTransform(1.8,1050.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_1 = new lib.white_square("synched",0);
	this.instance_1.setTransform(751.5,1050.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_2 = new lib.black_squre("synched",0);
	this.instance_2.setTransform(601.75,1050.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_3 = new lib.white_square("synched",0);
	this.instance_3.setTransform(451.5,1050.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_4 = new lib.black_squre("synched",0);
	this.instance_4.setTransform(301.75,1050.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_5 = new lib.white_square("synched",0);
	this.instance_5.setTransform(151.45,1050.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_6 = new lib.black_squre("synched",0);
	this.instance_6.setTransform(751.8,900.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_7 = new lib.white_square("synched",0);
	this.instance_7.setTransform(601.45,900.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_8 = new lib.black_squre("synched",0);
	this.instance_8.setTransform(451.8,900.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_9 = new lib.white_square("synched",0);
	this.instance_9.setTransform(301.45,900.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_10 = new lib.black_squre("synched",0);
	this.instance_10.setTransform(151.75,900.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_11 = new lib.white_square("synched",0);
	this.instance_11.setTransform(1.5,900.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_12 = new lib.black_squre("synched",0);
	this.instance_12.setTransform(1.8,750.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_13 = new lib.white_square("synched",0);
	this.instance_13.setTransform(751.5,750.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_14 = new lib.black_squre("synched",0);
	this.instance_14.setTransform(601.75,750.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_15 = new lib.white_square("synched",0);
	this.instance_15.setTransform(451.5,750.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_16 = new lib.black_squre("synched",0);
	this.instance_16.setTransform(301.75,750.4,1.5,1.5002,0,0,0,1.2,0.3);

	this.instance_17 = new lib.white_square("synched",0);
	this.instance_17.setTransform(151.45,750.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_18 = new lib.black_squre("synched",0);
	this.instance_18.setTransform(751.8,600.25,1.5,1.5002,0,0,0,1.2,0.2);

	this.instance_19 = new lib.white_square("synched",0);
	this.instance_19.setTransform(601.45,600.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_20 = new lib.black_squre("synched",0);
	this.instance_20.setTransform(451.8,600.25,1.5,1.5002,0,0,0,1.2,0.2);

	this.instance_21 = new lib.white_square("synched",0);
	this.instance_21.setTransform(301.45,600.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_22 = new lib.black_squre("synched",0);
	this.instance_22.setTransform(151.75,600.25,1.5,1.5002,0,0,0,1.2,0.2);

	this.instance_23 = new lib.white_square("synched",0);
	this.instance_23.setTransform(1.5,600.25,1.5,1.5002,0,0,0,1,0.2);

	this.instance_24 = new lib.black_squre("synched",0);
	this.instance_24.setTransform(1.8,450.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_25 = new lib.white_square("synched",0);
	this.instance_25.setTransform(751.5,450.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_26 = new lib.black_squre("synched",0);
	this.instance_26.setTransform(601.75,450.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_27 = new lib.white_square("synched",0);
	this.instance_27.setTransform(451.5,450.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_28 = new lib.black_squre("synched",0);
	this.instance_28.setTransform(301.75,450.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_29 = new lib.white_square("synched",0);
	this.instance_29.setTransform(151.45,450.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_30 = new lib.black_squre("synched",0);
	this.instance_30.setTransform(751.8,300.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_31 = new lib.white_square("synched",0);
	this.instance_31.setTransform(601.45,300.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_32 = new lib.black_squre("synched",0);
	this.instance_32.setTransform(451.8,300.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_33 = new lib.white_square("synched",0);
	this.instance_33.setTransform(301.45,300.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_34 = new lib.black_squre("synched",0);
	this.instance_34.setTransform(151.75,300.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_35 = new lib.white_square("synched",0);
	this.instance_35.setTransform(1.5,300.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_36 = new lib.black_squre("synched",0);
	this.instance_36.setTransform(1.8,150.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_37 = new lib.white_square("synched",0);
	this.instance_37.setTransform(751.5,150.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_38 = new lib.black_squre("synched",0);
	this.instance_38.setTransform(601.75,150.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_39 = new lib.white_square("synched",0);
	this.instance_39.setTransform(451.5,150.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_40 = new lib.black_squre("synched",0);
	this.instance_40.setTransform(301.75,150.1,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_41 = new lib.white_square("synched",0);
	this.instance_41.setTransform(151.45,150.1,1.5,1.5002,0,0,0,1,0.1);

	this.instance_42 = new lib.black_squre("synched",0);
	this.instance_42.setTransform(751.8,0.15,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_43 = new lib.white_square("synched",0);
	this.instance_43.setTransform(601.45,0.15,1.5,1.5002,0,0,0,1,0.1);

	this.instance_44 = new lib.black_squre("synched",0);
	this.instance_44.setTransform(451.8,0.15,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_45 = new lib.white_square("synched",0);
	this.instance_45.setTransform(301.45,0.15,1.5,1.5002,0,0,0,1,0.1);

	this.instance_46 = new lib.black_squre("synched",0);
	this.instance_46.setTransform(151.75,0.15,1.5,1.5002,0,0,0,1.2,0.1);

	this.instance_47 = new lib.white_square("synched",0);
	this.instance_47.setTransform(1.5,0.15,1.5,1.5002,0,0,0,1,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36},{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32},{t:this.instance_31},{t:this.instance_30},{t:this.instance_29},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.gamebox, new cjs.Rectangle(0,0,900,1200), null);


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

	// guide_mc
	this.guide_mc = new lib.guide_mc();
	this.guide_mc.name = "guide_mc";
	this.guide_mc.setTransform(1221.6,87.75);

	this.timeline.addTween(cjs.Tween.get(this.guide_mc).wait(1));

	// egg_mc_ac
	this.instance = new lib.egg_mc_ac();
	this.instance.setTransform(1496.55,445.4,1,1,0,0,0,0,-0.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_5
	this.text = new cjs.Text("-", "bold 96px 'Alibaba PuHuiTi 3.0 115 Black'", "#FFFFFF");
	this.text.lineHeight = 134;
	this.text.lineWidth = 100;
	this.text.parent = this;
	this.text.setTransform(835,102.85);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#E9A032").ss(8,1,1).p("As4p6IZxAAQDIAAAADIIAANlQAADIjIAAI5xAAQjIAAAAjIIAAtlQAAjIDIAAg");
	this.shape.setTransform(861.675,174.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CE7718").s().p("As4J7QjIAAAAjIIAAtmQAAjHDIgBIZxAAQDIABAADHIAANmQAADIjIAAg");
	this.shape_1.setTransform(861.675,174.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.text}]}).wait(1));

	// Layer_6
	this.text_1 = new cjs.Text("-", "bold 96px 'Alibaba PuHuiTi 3.0 115 Black'", "#FFFFFF");
	this.text_1.lineHeight = 134;
	this.text_1.lineWidth = 100;
	this.text_1.parent = this;
	this.text_1.setTransform(190.3,102.85);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#E9A032").ss(8,1,1).p("As4p6IZxAAQDIAAAADIIAANlQAADIjIAAI5xAAQjIAAAAjIIAAtlQAAjIDIAAg");
	this.shape_2.setTransform(216.975,174.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#CE7718").s().p("As4J7QjIAAAAjIIAAtmQAAjHDIgBIZxAAQDIABAADHIAANmQAADIjIAAg");
	this.shape_3.setTransform(216.975,174.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.text_1}]}).wait(1));

	// egg_mc0
	this.egg_mc0 = new lib.mc_egg1();
	this.egg_mc0.name = "egg_mc0";
	this.egg_mc0.setTransform(556.1,197.1,1,1,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc0).wait(1));

	// egg_mc1
	this.egg_mc1 = new lib.mc_egg2();
	this.egg_mc1.name = "egg_mc1";
	this.egg_mc1.setTransform(167,1641.2);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc1).wait(1));

	// egg_mc2
	this.egg_mc2 = new lib.mc_egg3();
	this.egg_mc2.name = "egg_mc2";
	this.egg_mc2.setTransform(318.65,1641.2);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc2).wait(1));

	// egg_mc3
	this.egg_mc3 = new lib.mc_egg4();
	this.egg_mc3.name = "egg_mc3";
	this.egg_mc3.setTransform(470.3,1641.2);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc3).wait(1));

	// egg_mc4
	this.egg_mc4 = new lib.mc_egg5();
	this.egg_mc4.name = "egg_mc4";
	this.egg_mc4.setTransform(621.95,1641.2);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc4).wait(1));

	// egg_mc5
	this.egg_mc5 = new lib.mc_egg6();
	this.egg_mc5.name = "egg_mc5";
	this.egg_mc5.setTransform(773.6,1641.2);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc5).wait(1));

	// egg_mc6
	this.egg_mc6 = new lib.mc_egg7();
	this.egg_mc6.name = "egg_mc6";
	this.egg_mc6.setTransform(925.3,1641.2);

	this.timeline.addTween(cjs.Tween.get(this.egg_mc6).wait(1));

	// gamebox
	this.gamebox = new lib.gamebox();
	this.gamebox.name = "gamebox";
	this.gamebox.setTransform(90,291.95);

	this.timeline.addTween(cjs.Tween.get(this.gamebox).wait(1));

	// long0
	this.instance_1 = new lib.long0();
	this.instance_1.setTransform(1933.8,1535.8,1,1,0,0,0,0.7,-1.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// long0
	this.instance_2 = new lib.long0();
	this.instance_2.setTransform(1775.35,1535.8,1,1,0,0,0,0.7,-1.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// long0
	this.instance_3 = new lib.long0();
	this.instance_3.setTransform(1617,1535.8,1,1,0,0,0,0.7,-1.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

	// long0
	this.instance_4 = new lib.long0();
	this.instance_4.setTransform(1458.65,1535.8,1,1,0,0,0,0.7,-1.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(1));

	// long0
	this.instance_5 = new lib.long0();
	this.instance_5.setTransform(1300.3,1535.8,1,1,0,0,0,0.7,-1.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1));

	// long0
	this.instance_6 = new lib.long0();
	this.instance_6.setTransform(1141.95,1535.8,1,1,0,0,0,0.7,-1.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(1));

	// Layer_25
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#006C8B").ss(8,1,1).p("EhLtgPnMCXbAAAQCaAAAACxIAAZsQAACyiaAAMiXbAAAQiaAAAAiyIAA5sQAAixCaAAg");
	this.shape_4.setTransform(540,1642.65);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#00365E").s().p("EhLtAPoQiaAAAAiyIAA5rQAAiyCaAAMCXbAAAQCaAAAACyIAAZrQAACyiaAAg");
	this.shape_5.setTransform(540,1642.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	// Layer_26
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#006C8B").ss(8,1,1).p("EhCZhjDMCEzAAAMAAADGHMiEzAAAg");
	this.shape_6.setTransform(540.0221,890.405,1.1119,0.9914);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#005F7C").s().p("EhCZBjDMAAAjGFMCEzAAAMAAADGFg");
	this.shape_7.setTransform(540.0221,890.405,1.1119,0.9914);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6}]}).wait(1));

	// longboss
	this.instance_7 = new lib.longboss();
	this.instance_7.setTransform(556.05,197.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(1));

	// Layer_28
	this.instance_8 = new lib.CachedBmp_1();
	this.instance_8.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(1));

	// Layer_29
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#10C5CE").s().p("EhUXCWAMAAAkr/MCovAAAMAAAEr/g");
	this.shape_8.setTransform(540,960);

	this.timeline.addTween(cjs.Tween.get(this.shape_8).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(540,918.7,1538.8000000000002,1001.3);
// library properties:
lib.properties = {
	id: '994179DFE830400BA68CFA701D2BB3AB',
	width: 1080,
	height: 1920,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_1.png", id:"CachedBmp_1"},
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