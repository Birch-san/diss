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
    this.container.className = "flyoutContainer";

    $(root).append(this.container);
    return this.container;
  };

  var p = Flyout.prototype;

  /*p.setX = function(x) {
    this.x = x;

    // convert to percent
    var elem = this.grid.getFirstGrid();
    var rect = elem.get(0).getBoundingClientRect();
    var pX = x*100/rect.width;
    $(".verticalHair").first().css({left:pX+"%"});
  };*/

  /*p.setY = function(y) {
    this.y = y;

    // convert to percent
    var elem = this.grid.getFirstGrid();
    var rect = elem.get(0).getBoundingClientRect();
    var pY = y*100/rect.height;

    $(".horizontalHair").first().css({top:pY+"%"});
  };*/

  p.show = function() {
    //this.hairs.className = "crosshairs shownCrosshairs";
  };
  p.hide = function() {
    //this.hairs.className = "crosshairs hiddenCrosshairs";
  };

  p.build = function(label) {
    var container = Flyout.getContainer(this.root);
   
    var aFlyout = document.createElement('div');
    aFlyout.className = "aFlyout";
   
    var lineDiv = document.createElement('div');
    lineDiv.className = "lineDiv";
    var svg = document.createElement('svg');
    svg.className = "lineSvg"
    var svgLine = document.createElement('line');
    svgLine.className = "line"
   //svgLine.style ="stroke:rgb(255,0,0);stroke-width:2";
    $(svgLine).attr({x1:"0",
                    y1:"0",
                    x2:"200",
                    y2:"200"});
    //$(svgLine).attr({"data-bind": "attr: {x1:x1,y1:y1,x2:x2,y2:y2}"});
    
    $(svg).append(svgLine);
   
    $(lineDiv).append(svg);
   
    var flyout = document.createElement('div');
    flyout.className = "flyout";
    flyout.innerHTML = label;
   
    $(aFlyout).append(flyout);
    $(aFlyout).append(lineDiv);
   
    $(container).append(aFlyout);
   
   // refresh namespace
    $(lineDiv).html($(lineDiv).html());
  };

  /*p.updatePosition = function() {
    var coords = this.grid.findPointerCoords();
    var centerX = coords.centerX;
    var centerY = coords.centerY;

    this.setX(centerX);
    this.setY(centerY);
  };*/

  p.initialize = function(root, label) {
    this.root = root;
    this.label = label;
    this.build(label);
    
   
    //this.updatePosition();
    //this.show();
  };
 
 p.setTarget = function(element, coordsyst) {
  var rect = element.getBoundingClientRect();
  var theX = rect.left;
  var theY = rect.top;
  
  /*var rect2 = coordsyst.getBoundingClientRect();
  var pX = theX*100/rect2.width;
  var pY = theY*100/rect2.height;*/
  
  /*$(".line").attr({x2:pX+"%",
                    y2:pY+"%"});*/
  
  $(".line").attr({x2:theX,
                    y2:theY});
 }

  birchlabs.Flyout = Flyout;
})();
  
});