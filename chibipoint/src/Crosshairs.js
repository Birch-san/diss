define([], function() {

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
    $(".verticalHair").first().css({left:pX+"%"});
  };

  p.setY = function(y) {
    this.y = y;

    // convert to percent
    var elem = this.grid.getFirstGrid();
    var rect = elem.get(0).getBoundingClientRect();
    var pY = y*100/rect.height;

    $(".horizontalHair").first().css({top:pY+"%"});
  };

  p.show = function() {
    this.hairs.className = "crosshairs shownCrosshairs";
  };
  p.hide = function() {
    this.hairs.className = "crosshairs hiddenCrosshairs";
  };

  p.createCrosshairs = function(root) {
    this.hairs = document.createElement('div');
    this.hairs.className = "crosshairs";

    this.horizontalHair = document.createElement('div');
    this.horizontalHair.className = "horizontalHair";

    this.verticalHair = document.createElement('div');
    this.verticalHair.className = "verticalHair";

    $(this.hairs).append(this.horizontalHair);
    $(this.hairs).append(this.verticalHair);

    $(root).append(this.hairs);
  };

  p.updatePosition = function() {
    var coords = this.grid.findPointerCoords();
    var centerX = coords.centerX;
    var centerY = coords.centerY;

    this.setX(centerX);
    this.setY(centerY);
  };

  p.initialize = function(root, grid) {
    this.createCrosshairs(root);
    this.grid = grid;
    this.updatePosition();
    this.show();
  };

  birchlabs.Crosshairs = Crosshairs;
})();
  
});