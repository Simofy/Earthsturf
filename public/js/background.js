class block{
  constructor(x, y, w, h, dir, angle, canvas){
    this.display = true;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dir = dir;
    this.angle = angle;
    this.previousState = 0;
    this.rotating = this.dir == 1 ? false : true;
    this.CurrentAngle = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.canvas = canvas;
    this.reDraw();
    this.angleStep = 10;//canvas.HALF_PI / 10;
    
  }
  setColor(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
  }
  update(){
    if(this.rotating == true){
      let dir = this.dir % 2;
      this.CurrentAngle+=dir == 0 ? this.angleStep : -this.angleStep;
      if(this.CurrentAngle > 90 || this.CurrentAngle < -90){
        this.rotating = false;
        this.CurrentAngle = 0;
        this.angle +=dir == 0 ? 90 : -90;
      }
    }
    this.canvas.setRotation(this.angle + this.CurrentAngle,this.x+this.w / 2,this.y-this.w / 2);
  }
  setRotDir(dir){
    if(this.rotating == false){
      this.CurrentAngle = 0;
      this.previousState = this.dir;
      this.rotating = true;
      this.dir = dir;
    }
  }
  setPos(x,y){
    this.x = x;
    this.y = y;
  }
  getPosition(){
    return this.x, this.y;
  }
  setSize(w, h){
    this.w = w;
    this.h = h;
  }
  setAngle(angle){
    this.angle = angle;
  }
  getAngle(){
    return this.angle;
  }
  getSize(){
    return this.w,this.h;
  }
  reDraw(){
    if(this.display){
      let canvas = this.canvas;
      let y = Math.cos(this.angle) * this.w / 2;
      let x = Math.sin(this.angle) * this.h / 4;
      canvas.moveTo(-this.w/2,-this.w/2);
      canvas.arcTo(this.w, this.w, 90, -90);
      canvas.moveTo(this.w/2 ,this.w/2);
      canvas.arcTo(this.w, this.w, 180, 90);
      //blockElm.setColor(210,180,140);
      canvas.stroke("#d2b48c", 4, null, "round");
      canvas.setRotation(this.angle + this.CurrentAngle,0,0);
      canvas.translate(this.x,this.y);
      //canvas.close();
    }
  }
}//end block class
//_________________________
$(document).ready(function(){
  var bg_0;

  /**
   * background animation class.
   * @constructor
   */
  background = function () {
      /**
       * Drops storage.
       * @type {Array.<Point3D>}
       */
      this.blockElm = [];
      //let i = 0;
      this.w_ = 80;
      let w_ = this.w_;
      for(let x = 0; x < stage.width() / w_ + 1; x++){
        let line = [];
        for(let y = 0; y < stage.height() / w_ + 1; y++){
          line.push(new block(x*w_, y*w_, w_ / 2, w_ / 2, randomInt(0,1), 0, stage.path()));
          line[line.length-1].update();
        }
        this.blockElm.push(line);
      }

  };
  //--------------------------------------------------------------------------------------------------------------
  //
  //  Utils.
  //
  //--------------------------------------------------------------------------------------------------------------
  /**
   * Gets random float.
   * @param {number} min - From.
   * @param {number} max - To.
   * @returns {number}
   */
  var randomFloat = function (min, max) {
      return min + (max - min) * Math.random();
  };
  /**
   * Gets random integer.
   * @param {number} min - From.
   * @param {number} max - To.
   * @returns {number}
   */
  var randomInt = function (min, max) {
      return Math.round(randomFloat(min, max));
  };
  /**
   * Complete repaint.
   */
  background.prototype.repaint = function () {
    
      stage.suspend();
      let rand =  randomInt(0, 100000);
      if(rand>93000){
        let randX = randomInt(0, this.blockElm.length-1);
        let randY = randomInt(0, this.blockElm[0].length-1);
        this.blockElm[randX][randY].setRotDir(randomInt(0,1));
      }
      for(let x = 0; x < this.blockElm.length; x++)
        for(let y = 0; y < this.blockElm[0].length; y++)
          this.blockElm[x][y].update();
      stage.resume();
  };
  background.prototype.update = function(){
    this.w_ = 80;
    let w_ = this.w_;
    for(let x = this.blockElm.length; x < stage.width() / w_ + 1; x++){
      let line = [];
      for(let y = 0; y < stage.height() / w_ + 1; y++){
        line.push(new block(x*w_, y*w_, w_ / 2, w_ / 2, randomInt(0,1), 0, stage.path()));
        line[line.length-1].update();
      }
      this.blockElm.push(line);
    }
    for(let x = 0; x < this.blockElm.length; x++){
      let line = [];
      for(let y = this.blockElm[x].length; y < stage.height() / w_ + 1; y++){
        this.blockElm[x].push(new block(x*w_, y*w_, w_ / 2, w_ / 2, randomInt(0,1), 0, stage.path()));
        //line
        this.blockElm[x][this.blockElm[x].length-1].update();
        //console.log("S");
      }
      //this.blockElm[x].push(line);
    }
    
  }
  //--------------------------------------------------------------------------------------------------------------
  //
  //  General.
  //
  //--------------------------------------------------------------------------------------------------------------
  var cont = document.getElementById('backgroundSketch');
  var stage = acgraph.create('backgroundSketch');
  window.requestAnimationFrame = window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (callback) {
              setTimeout(callback, 1000 / 60);
          };
  
  bg_0 = new background();
  draw();
  function draw() {
      window.requestAnimationFrame(draw);
      bg_0.repaint();
  }
  window.addEventListener('resize', function(){
    bg_0.update();
  }, true);
});