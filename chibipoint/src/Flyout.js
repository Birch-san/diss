define([], function() {

window.birchlabs = window.birchlabs||{};
var birchlabs = window.birchlabs;
 
(function() {
  var Flyout = function(root, label) {
    this.initialize(root, label);
  };
 
  Flyout.getContainer = function(root) {
   return this.container||this.makecontainer(root);
  };
 
  Flyout.makecontainer = function(root) {
    this.container = document.createElement('div');
    this.container.className = "flyoutContainer hiddenfC";

    $(root).append(this.container);
    return this.container;
  };

  var p = Flyout.prototype;

  p.setX = function(x) {
    //this.x = x;

    // convert to percent
    /*var elem = this.grid.getFirstGrid();
    var rect = elem.get(0).getBoundingClientRect();
    var pX = x*100/rect.width;
    $(".aFlyout").first().css({left:pX+"%"});*/
    $(this.aFlyout).css({left:x});
  };

  /*p.setY = function(y) {
    this.y = y;

    // convert to percent
    var elem = this.grid.getFirstGrid();
    var rect = elem.get(0).getBoundingClientRect();
    var pY = y*100/rect.height;

    $(".horizontalHair").first().css({top:pY+"%"});
  };*/

  Flyout.show = function() {
    Flyout.getContainer().className = "flyoutContainer shownfC";
    //this.hairs.className = "crosshairs shownCrosshairs";
  };
  Flyout.hide = function() {
   Flyout.getContainer().className = "flyoutContainer hiddenfC";
    //this.hairs.className = "crosshairs hiddenCrosshairs";
  };

  p.build = function(label) {
    var container = Flyout.getContainer(this.root);
   
    this.aFlyout = document.createElement('div');
    this.aFlyout.className = "aFlyout";
   
    this.lineDiv = document.createElement('div');
    this.lineDiv.className = "lineDiv";
    this.svg = document.createElement('svg');
    this.svg.className = "lineSvg"
    this.svgLine = document.createElement('line');
    this.svgLine.className = "line"
    this.svgLine.id = "birchFlyoutLine"+this.x;
   //svgLine.style ="stroke:rgb(255,0,0);stroke-width:2";
    $(this.svgLine).attr({x1:"0",
                    y1:"0",
                    x2:"200",
                    y2:"200"});
    //$(svgLine).attr({"data-bind": "attr: {x1:x1,y1:y1,x2:x2,y2:y2}"});
    
    $(this.svg).append(this.svgLine);
   
    $(this.lineDiv).append(this.svg);
   
    this.flyout = document.createElement('div');
    this.flyout.className = "flyout";
    this.flyout.innerHTML = String.fromCharCode(label);
   
    $(this.aFlyout).append(this.flyout);
    $(this.aFlyout).append(this.lineDiv);
   
    $(container).append(this.aFlyout);
   
   // refresh namespace
    $(this.lineDiv).html($(this.lineDiv).html());
  };

  /*p.updatePosition = function() {
    var coords = this.grid.findPointerCoords();
    var centerX = coords.centerX;
    var centerY = coords.centerY;

    this.setX(centerX);
    this.setY(centerY);
  };*/

  p.initialize = function(label, x, root) {
    this.x = x;
    this.root = root;
    this.build(label);
    this.setX(x);
   
    //this.updatePosition();
    //this.show();
  };
 
 p.setTarget = function(element, coordsyst) {
  if (element == null) {
   $("#"+this.svgLine.id).attr({x2:0,
                    y2:0});
   return;
  }
  var rect = element.getBoundingClientRect();
  var theX = rect.left;
  var theY = rect.top;
  
  /*var rect2 = coordsyst.getBoundingClientRect();
  var pX = theX*100/rect2.width;
  var pY = theY*100/rect2.height;*/
  
  $("#"+this.svgLine.id).attr({x2:theX-this.x,
                    y2:theY});
  
  /*$(this.svgLine).attr({x2:theX,
                    y2:theY});
  $(this.svgLine).attr({id:"hey"});
    //$(this.lineDiv).html($(this.lineDiv).html());
  $(this.lineDiv).html($(this.lineDiv).html());*/
 };

  birchlabs.Flyout = Flyout;
})();
  
});