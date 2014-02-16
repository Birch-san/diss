define(["lib/jquery-2.1.0.min", "lib/within"], function(jq, within) {

window.birchlabs = window.birchlabs||{};
var birchlabs = window.birchlabs;
 
(function() {
  var Crosshairs = function(root, grid) {
    this.initialize(root, grid);
  };

  var p = Crosshairs.prototype;

  p.setX = function(x) {
    this.x = x;

    // convert to percent
    var elem = this.grid.getFirstGrid();
    var rect = elem.get(0).getBoundingClientRect();
    var pX = x*100/rect.width;
    $(".chibiPoint_verticalHair").first().css({left:pX+"%"});
  };

  p.setY = function(y) {
    this.y = y;

    // convert to percent
    var elem = this.grid.getFirstGrid();
    var rect = elem.get(0).getBoundingClientRect();
    var pY = y*100/rect.height;

    $(".chibiPoint_horizontalHair").first().css({top:pY+"%"});
  };

  p.show = function() {
    this.hairs.className = "chibiPoint_crosshairs chibiPoint_shownCrosshairs";
  };
  p.hide = function() {
    this.hairs.className = "chibiPoint_crosshairs chibiPoint_hiddenCrosshairs";
    this.removeHighlights();
  };

  p.createCrosshairs = function(root) {
    this.hairs = document.createElement('div');
    this.hairs.className = "chibiPoint_crosshairs";

    this.horizontalHair = document.createElement('div');
    this.horizontalHair.className = "chibiPoint_horizontalHair";

    this.verticalHair = document.createElement('div');
    this.verticalHair.className = "chibiPoint_verticalHair";

    $(this.hairs).append(this.horizontalHair);
    $(this.hairs).append(this.verticalHair);

    $(root).append(this.hairs);
  };

  p.updatePosition = function() {
    var coords = this.grid.findPointerCoords();
    if (coords) {
     var centerX = coords.centerX;
     var centerY = coords.centerY;

     this.setX(centerX);
     this.setY(centerY);
    }
  };
 
  p.highlight = function(root) {
    var coords = this.grid.findPointerCoords();
    if (coords) {
     var centerX = coords.centerX;
     var centerY = coords.centerY;

     var element = $(root.elementFromPoint(centerX, centerY));

     // unhighlight previous element
     this.removeHighlights();
     this.targetedElement = element;

     element.addClass("chibiPoint_targeted");
     
     // doesn't seem to work :(
     /*element.trigger('mouseover');
     element.trigger('hover');
     element.trigger('mouseenter');
     element.mouseover();
     element.hover();
     element.mouseenter();*/
     //element.get(0).mouseover();
     //element.get(0).hover();
    
     return element;
    } else {
      return null;
    }
  };
 
 p.removeHighlights = function() {
    if (this.targetedElement) {
       this.targetedElement.removeClass("chibiPoint_targeted");
       this.targetedElement.removeClass("chibiPoint_cluck");
     }
 };

  p.initialize = function(root, grid) {
    this.targetedElement = null;
    this.createCrosshairs(root);
    this.grid = grid;
    this.updatePosition();
    this.show();
  };

  birchlabs.Crosshairs = Crosshairs;
})();
  
});