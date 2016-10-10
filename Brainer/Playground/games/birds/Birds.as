package {
	import flash.display.*;
	import flash.geom.*;
	import flash.net.*;
	import flash.events.*;
	import flash.text.*;
	import fl.transitions.*;
	import fl.transitions.easing.*;	
	import flash.ui.*;
	import flash.media.Sound;
	
	
	
	
	

	public class Birds {
		private var stage;
		private var buttons:Array = [];
		private var scoreBack:MovieClip = new MovieClip();
		private var wrapper: Sprite = new Sprite();
		private var scores: Sprite = new Sprite();
		private var stopBg:Sprite = new Sprite(); // при паузе
		private var oval:Sprite = new Sprite();
		private var ovsh:Sprite = new Sprite();
		private var work:Sprite = new Sprite();
		private var spr:Sprite = new Sprite();
		private var cent:Sprite = new Sprite();;
		private var toLine:Sprite = new Sprite();
		private var cursor:MovieClip = new MovieClip();
		private var ptichka:Number = 128;
		private var bg:Bitmap = new Bitmap();
		private var tem:Bitmap = new Bitmap();
		private var bd:BitmapData;
		private var level:int = 0;
		private var status:int = 0; // pause, stop or playing
		private var oldLevel:int = 0;
		private var levels:Array = [200, 250, 300, 350, 400, 450, 500, 500, 500, 500, 500, 500];
		private var levelScores:Array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		private var t:TextField = new TextField();
		private var plus:TextField = new TextField();
		private var scoreText:TextField = new TextField();
		private var levelText:TextField = new TextField();
		private var bds:Array = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3];
		private var msr:Array = [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 2];
		private var brd:Array = [];
		private var mrd:Array = [];
		private var scoreList:Array = [];
		private var loader:Loader = new Loader();
		private var loadData:Array = ["bg.jpg", "sheet.png"];
		private var loadedData:Array = [];
		private var bdata:BitmapData;
		private var answer:int = 0;
		private var timer:int = 0;
		private var score:int = 0;
		private var allScore:int = 0;
		private var scorePerClick:int = 100;
		private var curLevel:int = 1;
		private var minIndex:int = -1;
		private var answers:Sprite = new Sprite();
		private var maxTime:int = 21;
		private var curRad:int = 200;
		private var curScore:int = 0;
		private var mclick;
		private var menter;
		private var sounds: Array = new Array();
		private var name: String = new String();
		private var ava: String = new String();
		private var id: int ;
		
		
		
		public function Birds(st) {			 
			this.stage = st;
			this.level = 1;
			this.dataLoader();			
			
			
			this.cent.visible = false;
			this.answers.visible = false;
			this.stage.align = StageAlign.TOP_LEFT;
			
			
			this.work.x = 0;
			this.work.y = 0;
			
			
			this.plus.background = true;
			this.plus.backgroundColor = 0xffffff;
			this.plus.textColor = 0xcc0000;				
			this.plus.height = 20;
			this.plus.width = 30;	
			
			
			this.stage.addEventListener(Event.RESIZE, this.winResize);
								
		}
		
		private function dataLoader(){//('this.loadData[0] = ' + this.loadData[0]);
			this.loader.load(new URLRequest(this.loadData[0]));
			this.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.loaderComplete);
		}
		
		public function loaderComplete(e:Event):void{ 
			this.loadedData.push(e.target.content.bitmapData);
			var _this = this;
			
			
			this.loadData.splice(0, 1);
			if(this.loadData.length > 0) this.dataLoader();
			else this.setUserInfo();
		}
		
		private function setUserInfo(flag:int = 0){ 
		
			
		var _this = this;
		
		
		
		
		
		
			var loader:URLLoader = new URLLoader();
			
			loader.load(new URLRequest("../../../birds.php?h=" + Math.random().toString())); 		
		
			loader.addEventListener(Event.COMPLETE, function(e: Event){			
				
				if(parseInt(e.target.data) != -1){
				
					var a: Array = e.target.data.split('|');
					
					for(var i:int = 1; i < a.length; i++){
						_this.scoreList.push(a[i].split(','));
					}
					
					if(flag == 0){
						var user: Array = a[0].split(',');
						_this.name = user[1];
						_this.id = user[0];
						_this.ava = user[2];
						_this.level = parseInt(user[3], 10) - 1;
						_this.init();					
					}
					else _this.showScore();
				}
				
				
			});
		}
		
		
		private function init(){
			this.bg = new Bitmap(this.loadedData[0]);
			this.tem = new Bitmap(this.loadedData[0]);
			
			this.spr.graphics.beginFill(0x000000, 0.75);
			this.spr.graphics.drawRect(0, 0, this.tem.width, this.tem.height);
			this.spr.graphics.endFill();
			this.stage.addChild(this.tem);
			this.stage.addChild(this.spr);
			
			this.sounds.push(new Sound(new URLRequest("sound.mp3")));
			this.sounds.push(new Sound(new URLRequest("error.mp3")));
			
			
			
			this.stage.addChild(this.bg);
			this.stage.addChild(this.oval);
			this.work.graphics.beginFill(0x000000, 0);
			this.work.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
			this.work.graphics.endFill();
			this.stage.addChild(this.work);
			
			this.stage.addChild(this.cent);
			
			this.stage.addChild(this.ovsh);
			this.bg.mask = this.oval;				
			
			this.ansList();				
			this.drawCursor();
			this.renderScore();
			this.startGame();
			this.stage.addChild(this.answers);
		}
			
			
		private function renderScore(){			
			this.bdata = new BitmapData(575, 64, true, 0x00000000);
			this.bdata.copyPixels(this.loadedData[1], new Rectangle(0, 192, 575, 64), new Point(0, 0));					
			this.scoreBack.addChild(new Bitmap(this.bdata));
			
			this.scoreText.defaultTextFormat = this.getFormat(40);
			this.scoreText.x = 440;
			this.scoreText.y = 2;
			this.scoreText.width = 250;
			this.scoreText.text = '0';
			
			this.levelText.defaultTextFormat = this.getFormat(40);
			this.levelText.x = 280;
			this.levelText.y = 2;
			
						
			var _this = this;
			
			
			var coors: Array = [[384, 0], [431, 0], [477, 0], 16, 61, 108];
			var navFunctions: Array = [this.play, this.pause, this.stop];
			for(var btn:int = 0; btn < 3; btn++){
				var btns: MovieClip = new MovieClip();
				_this.bdata = new BitmapData(575, 64, true, 0x00000000);
				_this.bdata.copyPixels(_this.loadedData[1], new Rectangle(coors[btn][0], coors[btn][1], 37, 37), new Point(0, 0));					
				btns.addChild(new Bitmap(_this.bdata));
				
				this.buttons.push(btns);
				
				btns.addEventListener(MouseEvent.MOUSE_OVER, function(e:MouseEvent){
					Mouse.show();
					_this.cursor.visible = false;
				});
				
				btns.addEventListener(MouseEvent.MOUSE_OUT, function(e:MouseEvent){
					if(_this.status == 0) Mouse.hide(); 
					_this.cursor.visible = true; 
				});
				
				btns.addEventListener(MouseEvent.CLICK, navFunctions[btn]);
				
				btns.x = coors[btn+3];
				btns.y = 13.5;
				
				this.scoreBack.addChild(btns);
			}
			
			
			
			
			
			
			
			
			this.scoreBack.addChild(this.levelText);
			this.scoreBack.addChild(this.scoreText);
			this.stage.addChild(this.scoreBack);
			//this.winResize()
		}
		
		private function getFormat(sz: int):TextFormat{
			var myFormat:TextFormat = new TextFormat(); 
			myFormat.font = 'Tahoma';
			myFormat.color = 0x808080;
			myFormat.size = sz;
			myFormat.bold = true;
			return myFormat;
		}
		
		
		private function startGame(e:Event = null){								
			this.curRad = this.levels[this.level - 1];		
			
			this.showOval(this.curRad);
			
			this.winResize();
			
			this.answer = Math.round(Math.random() * 4); 			
			this.setNumber(this.answer); 
			this.levelText.text = (this.level < 10) ? '0' + this.level.toString() : this.level.toString();
			
			for(var i:int = 0; i < this.bds[this.level - 1]; i++){
				this.bdata = new BitmapData(64, 64, true, 0x00000000);
				var rect = new Rectangle(0, 0, 64, 64);
				this.bdata.copyPixels(this.loadedData[1], rect, new Point(0, 0));
				
				
				this.brd[i] = new Sprite();
				var bm = new Bitmap(this.bdata);
				this.getPoint(this.brd[i]);				
				this.brd[i].addChild(bm);
				this.brd[i].visible = false;
				this.work.addChild(this.brd[i]);
			}
			
			
			var x: Number, y: Number;
			for(i = 0; i < this.msr[this.level - 1]; i++){
				this.bdata = new BitmapData(64, 64, true, 0x00000000);
				rect = new Rectangle(0, 64, 64, 64);
				this.bdata.copyPixels(this.loadedData[1], rect, new Point(0, 0));		
				
				
				this.mrd[i] = new MovieClip();
				var spr = new Sprite();
				bm = new Bitmap(this.bdata);
				this.getPoint(this.mrd[i]);
				while((Math.abs(this.mrd[i].x - this.brd[0].x) <= 64) || (Math.abs(this.mrd[i].y - this.brd[0].y) <= 64)) this.getPoint(this.mrd[i]);
				spr.addChild(bm);
				this.mrd[i].addChild(spr);
				this.mrd[i].visible = false; //////('xy = ' + this.mrd[i].x + ' -> ' + this.mrd[i].y + ' brdxy = ' + this.brd[0].x + ' -> ' + this.brd[0].y);
				this.work.addChild(this.mrd[i])
			}
			
			this.stage.addEventListener(Event.ENTER_FRAME, this.showWorkSpace);
			this.menter = this.showWorkSpace;
			
		}
		
		
		private function nextLevel(e:Event = null):void{
			
			this.oldLevel = this.level;
			this.levelScores[this.level-1] = this.score;
			this.level ++;
			this.curLevel = 1;
			this.saveScore();
			if(this.level >= this.levels.length) { this.level = 1;  this.setUserInfo(1);}			
			else{
				this.stage.addEventListener(Event.ENTER_FRAME, this.changeOval);
				this.menter = this.changeOval;
			}
		}
		
		
		private function prevLevel(f: int = 0){
			this.saveScore();
			if(f == 0) this.oldLevel = this.level;
			
			
			this.stage.removeEventListener(MouseEvent.CLICK, this.setPtichka);
			this.level --;
			this.score = (this.level == 1) ? 0 : this.levelScores[this.level-1];
			if(this.toLine.parent == this.stage) this.stage.removeChild(this.toLine);
			this.toLine.graphics.clear();
			this.toLine.graphics.lineStyle(3, 0x0637b4, 1);
			this.curLevel = 1;
			this.curScore = 0;
			if(this.level < 1) { this.level = 1; this.startGame();}			
			else {
				this.stage.addEventListener(Event.ENTER_FRAME, this.changeOval);
				this.menter = this.changeOval;				
			}
		}
		
		
		
		private function winResize(e:Event = null):void{ //////('win1: x = ' + this.oval.x + ' y = ' + this.oval.y);
			this.oval.x = (this.stage.stageWidth/2);
			this.oval.y = (this.stage.stageHeight/2);
			this.cent.x = (this.stage.stageWidth/2) - 32;
			this.cent.y = (this.stage.stageHeight/2) - 32;
			this.ovsh.x = this.oval.x;
			this.ovsh.y = this.oval.y;
			this.answers.x = (this.stage.stageWidth/2) - 180;
			this.answers.y = (this.stage.stageHeight/2) - 32;
			this.scoreBack.x = (this.stage.stageWidth/2) - (this.scoreBack.width/2);
			
			
			
			this.work.width = this.stage.stageWidth;
			this.work.height = this.stage.stageHeight;
		}
		
		private function getPoint(xy:Object):void{			
			var rx:Number = 0, ry:Number = -1;
			var rad: Number = (this.oval.width / 2);
			var minX:Number = rad - (this.ptichka / 2);
			
			while((rx > minX) || (rx < this.ptichka)) rx = Math.round(Math.random() * minX);
			minX = Math.sqrt(rad*rad - rx*rx) - (this.ptichka / 2);
			var maxX:int = ((this.ptichka/2) < rx) ? 0 : (this.ptichka/2)
			
			while((ry > minX) || (ry < maxX))	ry = Math.round(Math.random() * minX); 
			
			var x1y:Array = [-1, 1], xyy:Array = [];
			var nx:Number = Math.round(Math.random() * 1);
			if(nx == 0){
				xy.x = (this.stage.stageWidth / 2) + rx * x1y[Math.round((Math.random() * 1))];
				xy.y = (this.stage.stageHeight / 2) + ry * x1y[Math.round((Math.random() * 1))]; 
			}
			else{
				xy.x = (this.stage.stageWidth / 2) + ry * x1y[Math.round((Math.random() * 1))];
				xy.y = (this.stage.stageHeight / 2) + rx * x1y[Math.round((Math.random() * 1))]; 
			}
		}
		
		
		private function showWorkSpace(e:Event):void{
			this.timer ++;
			if(this.timer == 60){
				this.timer = 0;
				this.stage.removeEventListener(Event.ENTER_FRAME, this.showWorkSpace);
				//////('l = ' + this.msr.length);
				for(var i:int = 0; i < this.brd.length; i++)
					this.brd[i].visible = true;;
				
				for(i = 0; i < this.mrd.length; i++)
					this.mrd[i].visible = true;
				
				this.cent.visible = true;
				this.stage.addEventListener(Event.ENTER_FRAME, this.hideWorkSpace);	
				this.menter = this.hideWorkSpace;
			}
		}
		
		private function hideWorkSpace(e:Event):void{
			this.timer ++;
			if(this.timer == (this.maxTime - ((this.level <= 8) ? this.level-1 : 0) )){
				this.timer = 0;
				this.stage.removeEventListener(Event.ENTER_FRAME, this.hideWorkSpace);
				
				for(var i:int = 0; i < this.brd.length; i++)
					this.brd[i].visible = false;
				
				for(i = 0; i < this.mrd.length; i++)
					this.mrd[i].visible = false;
				
				this.cent.visible = false;
				this.stage.addEventListener(MouseEvent.CLICK, this.setPtichka);
				this.mclick = this.setPtichka;
			}
		}
		
		private function setPtichka(e:MouseEvent):void{
			if(this.status == 3) { this.status = 0; return; }
			else if(this.status != 0) return;
			
			var x:int = e.stageX, y:int = e.stageY, rad:int, oldRad:int = 10000, dx:int, dy:int;
			for(var i:int = 0; i < this.brd.length; i++){
				dx = x - this.brd[i].x - 32;
				dy = y - this.brd[i].y - 32
				rad = Math.sqrt(dx*dx + dy*dy);		
				if(rad < oldRad){
					oldRad = rad;
					this.minIndex = i;
				}
			}
			
			this.brd[this.minIndex].visible = true;	
			this.stage.removeEventListener(MouseEvent.CLICK, this.setPtichka);
			
			if(oldRad <= (this.brd[this.minIndex].width / 2)){
				rad = Math.abs(this.scorePerClick - oldRad);
				this.curScore += rad;
				this.plus.text = ' +' + rad.toString();
				this.brd[this.minIndex].addChild(this.plus);
				this.sounds[0].play();
			}
			else{
				this.toLine.graphics.clear();
				this.toLine.graphics.lineStyle(3, 0x0637b4, 1);
				this.toLine.graphics.moveTo(x, y);
				this.toLine.graphics.lineTo((this.brd[this.minIndex].x + 32), (this.brd[this.minIndex].y + 32));
				this.stage.addChild(this.toLine);
				this.curLevel --;
				this.sounds[1].play();
			}
			//('this.curLevel = ' + this.curLevel);
			this.stage.addEventListener(Event.ENTER_FRAME, this.deleteBrd);
			this.menter = this.deleteBrd;
		}
		
		
		private function deleteBrd(e:Event):void{
			this.timer ++;
			if(this.timer == 30){
				this.timer = 0;
				this.work.removeChild(this.brd[this.minIndex]);
				this.brd.splice(this.minIndex, 1);
				this.stage.removeEventListener(Event.ENTER_FRAME, this.deleteBrd);
				if(this.toLine.parent == this.stage) this.stage.removeChild(this.toLine);
				
				if(this.curLevel > 0){
					// trace('this.curScore = ' + this.curScore);
					this.stage.addEventListener(MouseEvent.CLICK, this.setPtichka);
					this.mclick = this.setPtichka;					
					
					if(this.brd.length == 0 && this.curScore > 0){						
						this.stage.removeEventListener(MouseEvent.CLICK, this.setPtichka);
						this.answers.visible = true;
					}
					else {
						this.oldLevel = this.level;
						this.level ++;
						this.prevLevel(1);
					}
				}
				else this.prevLevel();
			}
		}
		
		private function setNumber(i:int):void{			
			if(this.cent.numChildren) this.cent.removeChild(this.cent.getChildAt(0));
			this.cent.addChild(this.getNumber(i));			
		}
		
		private function getNumber(i:int):MovieClip{
			var sheet:Array = [[128, 0], [256, 0], [192, 64], [0, 128], [128, 128], [256, 128], [64, 0]];
			var bdata:BitmapData = new BitmapData(64, 64, true, 0x00000000);
			var rect = new Rectangle(sheet[i][0], sheet[i][1], 64, 64);
			bdata.copyPixels(this.loadedData[1], rect, new Point(0, 0));
			var bmap:Bitmap = new Bitmap(bdata); 
			var spr:MovieClip = new MovieClip();
			spr.addChild(bmap);
			return spr;
		}
		
		
		private function getKubok():MovieClip { 
			var i = (this.curLevel >= 1) ? (this.curLevel - 1) : 0;
			var sheet:Array = [[320, 128], [320, 128], [320, 128], [320, 128]];
			var bdata:BitmapData = new BitmapData(64, 64, true, 0x00000000);
			var rect = new Rectangle(sheet[i][0], sheet[i][1], 64, 64);
			bdata.copyPixels(this.loadedData[1], rect, new Point(0, 0));
			var bmap:Bitmap = new Bitmap(bdata);
			var spr:MovieClip = new MovieClip();
			spr.addChild(bmap);
			return spr;
		}
		
		private function ansList():void{
			var _this = this;
			var sprs:Array = [];
			for(var i:int = 0; i < 5; i++){				
				sprs[i] = this.getNumber(i);
				this.answers.addChild(sprs[i]);
				sprs[i].y = 0;
				sprs[i].x = (i * 64) + 20;
				sprs[i].width = 64 + i*0.1;
				sprs[i].height = 64;
				sprs[i].addEventListener(MouseEvent.CLICK, this.setAnswer);				
				sprs[i].transition = Fade;
			}
			
			this.answers.addChild(this.getNumber(6));
			this.answers.addChild(this.getNumber(5));
			this.answers.getChildAt(6).visible = false;
			this.answers.getChildAt(5).visible = false;
		}
		
		private function setAnswer(e:MouseEvent):void{
			var i:int = Math.round((e.target.width - 64)/0.1);			
			
			this.rightAnswer();
			if(i == this.answer){				
				this.curLevel ++;				
				this.score += this.curScore;
				this.curScore = 0; 
				this.sounds[0].play();
				if(this.score < 10)
					this.scoreText.text = '000' + this.score.toString();
				else if(this.score < 100)
					this.scoreText.text = '00' + this.score.toString();
				else if(this.score < 1000)
					this.scoreText.text = '0' + this.score.toString();
				else					
					this.scoreText.text = this.score.toString();				
			}
			else{
				this.sounds[1].play();
				this.answers.getChildAt(6).visible = true;
				this.answers.getChildAt(6).x = (i*64) + 20;									
				this.curLevel --; 
				this.curScore = 0;
				this.stage.addEventListener(Event.ENTER_FRAME, this.waitingSec);
				this.menter = this.waitingSec;
			}
		}
		
		
		private function waitingSec(e:Event){
			this.timer ++;
			if(this.timer == 30){
				this.timer = 0;				
				this.answers.getChildAt(6).visible = false;
				this.answers.getChildAt(5).visible = false;
				this.answers.visible = false;
				
				this.stage.removeEventListener(Event.ENTER_FRAME, this.waitingSec);
				if(this.curLevel == -1) this.prevLevel();
				else if(this.curLevel == 5) this.nextLevel()
				else this.startGame();
			}			
		}
		
		
		private function changeOval(e:Event){
			
			this.timer ++; 
			if(this.timer == 10){
				this.timer = 0;
				this.stage.removeEventListener(Event.ENTER_FRAME, this.changeOval);
				this.startGame();
			}


			// trace(this.oldLevel + '=>' + this.levels[this.oldLevel] + ' x ' + this.level + '=>' + this.levels[this.level]);
			if(this.levels[this.oldLevel-1] != this.levels[this.level-1]) 
				this.curRad += (this.oldLevel < this.level) ? 5 : -5;
			this.showOval(this.curRad);
		}
		
		private function showOval(r:int): void{ 
			this.oval.graphics.clear();			
			this.oval.graphics.beginFill(0xffffff);
			this.oval.graphics.drawCircle(0, 0, r);				
			this.oval.graphics.endFill();
			
			this.ovsh.graphics.clear();	
			this.ovsh.graphics.lineStyle(1, 0xffffff);
			this.ovsh.graphics.drawCircle(0, 0, r);			
		}
		
		
		
		private function animationComplete(e:Event):void{
			this.stage.addEventListener(Event.ENTER_FRAME, this.waitingSec);
			this.menter = this.waitingSec;
		}
		
		
		private function rightAnswer(){ 
			this.answers.removeChild(this.answers.getChildAt(5));
			this.answers.addChildAt(this.getKubok(), 5);
			var spr = this.answers.getChildAt(5);
			spr.x = (this.answer*64)+ 20;
			
			var mtr:TransitionManager = new TransitionManager(spr);
			mtr.startTransition({type:Fade, direction:Transition.IN, duration:1, easing:Regular.easeOut, shape:Iris.CIRCLE});			 
			mtr.addEventListener("allTransitionsInDone", this.animationComplete);
		}
		
		
		private function drawCursor(){
			var _this = this;
			var bdata:BitmapData = new BitmapData(52, 40, true, 0x00000000);
			var rect = new Rectangle(320, 0, 52, 40);
			bdata.copyPixels(this.loadedData[1], rect, new Point(0, 0));
			var bmap:Bitmap = new Bitmap(bdata);
			this.cursor.addChild(bmap);			
			this.stage.addChild(this.cursor);
			Mouse.hide();
			this.stage.addEventListener(MouseEvent.MOUSE_MOVE,	this.setCursor);
		}
		
		private function setCursor(e:MouseEvent){
			this.cursor.x = e.stageX - 26; 
			this.cursor.y = e.stageY - 20;		
		}
		
		
		
		private function pause(e:MouseEvent){ 
			this.timer = 1000000;
			this.status = 1;
			this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.setCursor);
			this.cursor.visible = false;
			Mouse.show();
			
			this.stage.displayState="normal";
			this.setStopPauseWrapper();
		}
		
		
		private function play(e:MouseEvent = null){ 
			
			this.status = 3;
			if(this.wrapper.parent == this.stage) this.stage.removeChild(this.wrapper);
			this.stage.displayState="fullScreen";
			this.stage.addEventListener(MouseEvent.MOUSE_MOVE,	this.setCursor);
			if(this.timer > 100000) this.timer = 0;
			else this.startGame(); 
		}
		
		
		
		
		private function stop(e:MouseEvent = null, flag: int = 0){
			this.scoreText.text = '0';
			this.levelText.text = '01';
			
			this.curLevel = 1;
			this.maxTime = 21;
			this.showOval(200);
			this.status = 2;
			
			var arr: Array = [this.work, this.cent, this.oval, this.spr, this.ovsh, this.answers, this.scoreBack,  this.tem, this.bg];
			for(var i:int = 0; i < arr.length; i++){ //('i = ' + i);
				if(i < (arr.length - 2))
					while(arr[i].numChildren > 0) arr[i].removeChild(arr[i].getChildAt(0));				
				if(i < (arr.length - 3))
					arr[i].graphics.clear();
				arr[i].parent.removeChild(arr[i]);
			}			
			
			
			if(this.stage.hasEventListener(Event.ENTER_FRAME)) this.stage.removeEventListener(Event.ENTER_FRAME, this.menter)
			if(this.stage.hasEventListener(MouseEvent.CLICK)) this.stage.removeEventListener(MouseEvent.CLICK, this.mclick)
			this.timer = 0;
			this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.setCursor);
			
			this.cursor.visible = false;
			Mouse.show();
			this.stage.displayState="normal";
			this.saveScore();
			this.level = 1;
		}
		
		private function setStopPauseWrapper(): void{
			if(this.wrapper.numChildren == 0){
				this.bdata = new BitmapData(135, 135, true, 0x00000000);
				this.bdata.copyPixels(this.loadedData[1], new Rectangle(0, 256, 135, 135), new Point(0, 0));			
				this.wrapper.graphics.beginFill(0x000000, 0.75);
				this.wrapper.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
				this.wrapper.graphics.endFill();
				var bm: Bitmap = new Bitmap(this.bdata);
				bm.x = (this.stage.stageWidth / 2) - (bm.width / 2);
				bm.y = (this.stage.stageHeight / 2) - (bm.height / 2);			
				this.wrapper.addEventListener(MouseEvent.CLICK, this.play);
				this.wrapper.addChild(bm);
			}
			
			this.stage.addChild(this.wrapper);
		}
		
		
		
		private function showScores(): void{
			
			this.scores.graphics.beginFill(0xffffff, 0.8);
			this.scores.graphics.lineStyle(10, 0xffffff, 1);
			this.scores.graphics.drawRect(0, 0, 600, 500);
			this.scores.graphics.endFill();			
			this.scores.x = (this.stage.stageWidth / 2) - (this.scores.width / 2);
			this.scores.y = (this.stage.stageHeight / 2) - (this.scores.height / 2);
			
			
			
			var yourScore: TextField = new TextField();
			var curS: TextField = new TextField();
			var recS: TextField = new TextField();
			
			yourScore.defaultTextFormat = this.getFormat(40);
			yourScore.text = 'Результаты';
			yourScore.width = 250;
			yourScore.x = 300 - (yourScore.width / 2);
			yourScore.y = 15;
			this.scores.addChild(yourScore);
			
			
			curS.height = 350;
			curS.width = 500;
			curS.x = 300 - (curS.width / 2);
			curS.y = 75;
			curS.multiline = true
			this.scores.addChild(curS);
			
			
			
			var str: String = new String();
			str = "<font color='#404040' size='15' face='tahoma'><p><font color='#25b409' size='17'>Текущий результат: " + this.score + " очков</font><br/></p><p>&nbsp;</p><p><font color='#25b409' size='17'>Лучшие результаты:</font></p><br/>";
			for(var i: int; i < this.scoreList.length; i++){
				if(i == 0)
					str += "<p><font color='#f24713' size='17'>" + (i + 1) + ". " + this.scoreList[i][0] + " очков \t\t\t\t\t" + this.scoreList[i][1] + "</font></p><br/>";
				else 
					str += "<p>" + (i + 1) + ". " + this.scoreList[i][0] + " очков \t\t\t\t\t" + this.scoreList[i][1] + "</p><br/>";
				
				
			}
			curS.htmlText = str + '</font>';
			
			
			if(this.stage.hasEventListener(Event.ENTER_FRAME)) this.stage.removeEventListener(Event.ENTER_FRAME, this.menter)
			if(this.stage.hasEventListener(MouseEvent.CLICK)) this.stage.removeEventListener(MouseEvent.CLICK, this.mclick)
			this.timer = 0;
			
			
			this.bdata = new BitmapData(135, 135, true, 0x00000000);
			this.bdata.copyPixels(this.loadedData[1], new Rectangle(135, 265, 135, 45), new Point(0, 0));
			var bm: Sprite = new Sprite()
			bm.addChild(new Bitmap(this.bdata));
			bm.x = 345;
			bm.y = 400;
			bm.buttonMode = true;
			this.scores.addEventListener(MouseEvent.CLICK, this.replay);
			bm.addEventListener(MouseEvent.MOUSE_OVER, function(e:MouseEvent){
				Mouse.cursor = MouseCursor.BUTTON;
			});
			
			bm.addEventListener(MouseEvent.MOUSE_OUT, function(e:MouseEvent){
				Mouse.cursor = MouseCursor.AUTO;
			});
			
			
			
			this.scores.addChild(bm);
			this.stage.addChild(this.scores);			
			
			
			this.saveScore();
		}
		
		private function replay(e:MouseEvent){
			while(this.scores.numChildren > 0) this.scores.removeChild(this.scores.getChildAt(0));
			this.scores.graphics.clear();
			this.stage.removeChild(this.scores);
			this.stop();			
		}
		
		private function saveScore(){
			var loader:URLLoader = new URLLoader();
			loader.load(new URLRequest('../../../birds.php?l=' + this.level.toString() + '&score=' + this.score.toString())); 
		}
		
	}
}
