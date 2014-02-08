define(["lib/knockout-3.0.0"], function(knockout) {

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
    /*$(svgLine).attr({x1:"0",
                    y1:"0",
                    x2:"200",
                    y2:"200"});*/
    $(svgLine).attr({"data-bind": "attr: {x1:x1,y1:y1,x2:x2,y2:y2}"});
    
    /*$(svgLine).attr({x1:"0",
                    y1:"0",
                    x2:"200",
                    "data-bind":"y2: d"});*/
   
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
   
   var ko = knockout;
   
   function WhateverModel() {
    //var self = this;
    this.x1 = ko.observable(0);
    this.y1 = ko.observable(0);
    this.x2 = ko.observable(200);
    this.y2 = ko.observable(200);
   }
   
   $(lineDiv).ready(function() {
    ko.applyBindings(new WhateverModel(), $(lineDiv));
   });
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

  birchlabs.Flyout = Flyout;
})();
  
});