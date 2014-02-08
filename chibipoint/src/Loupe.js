define(["lib/html2canvas"], function(h2c) {

 
window.birchlabs = window.birchlabs||{};
var birchlabs = window.birchlabs;

(function(){
  var Loupe = function(root) {
    this.initialize(root);
  }
  var p = Loupe.prototype;
 
 /*p.setX = function(x) {
    this.x = x;

    // convert to percent
    var elem = this.grid.getFirstGrid();
    var rect = elem.get(0).getBoundingClientRect();
    var pX = x*100/rect.width;
    $(".verticalHair").first().css({left:pX+"%"});
  };

  p.setY = function(y) {
    this.y = y;

    // convert to percent
    var elem = this.grid.getFirstGrid();
    var rect = elem.get(0).getBoundingClientRect();
    var pY = y*100/rect.height;

    $(".loupe").first().css({top:pY+"%"});
  };*/
 
  p.build = function(root) {
    this.loupe = document.createElement('canvas');
    this.loupe.className = "loupe";

    $(root).append(this.loupe);
  };

  p.initialize = function(root) {
   this.build(root);
   this.root = root;
  };
 
  p.magnify = function(element) {
   console.log(element);
   
   var me=$(".loupe").first().get(0);
   var ctx=me.getContext("2d");
   
   /*html2canvas(element, {
    onrendered: function(canvas) {
      $(this.root).appendChild(canvas);
    },
    width: 300,
    height: 300
  }*/
   html2canvas(element, {
  onrendered: function(canvas) {
   ctx.drawImage(canvas, 0, 0);
    //document.body.appendChild(canvas);
   //canvas.className = ".loupe";
  },
    width: 100,
  height: 100,
  allowTaint:true
   });
   
    
  };

  birchlabs.Loupe = Loupe;
})();
  
});