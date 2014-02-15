define(["lib/jquery-2.1.0.min", "lib/within"], function(jq, within) {

window.birchlabs = window.birchlabs||{};
var birchlabs = window.birchlabs;
 
(function() {
  var Flyout = function(root, label) {
    this.initialize(root, label);
  };
 
  Flyout.latestId = 0;
 
  Flyout.getNextId = function() {
    return Flyout.latestId++;
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
    x = Math.max(2, x);
    this.x = x;

    // convert to percent
    var rect = Flyout.getContainer().getBoundingClientRect();
    var pX = x*100/rect.width;
    $(this.flyout).css({left:pX+"%"});
    //$(this.flyout).css({left:x});
    //$(this.flyout).css({left:x});
  };
  
  p.setY = function(y) {
     y = Math.max(2, y);
     this.y = y;

     // convert to percent
     var rect = Flyout.getContainer().getBoundingClientRect();
     var pY = y*100/rect.height;
     $(this.flyout).css({top:pY+"%"});
     //$(this.flyout).css({left:x});
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
 
  p.hide = function() {
   $(this.aFlyout).addClass("birchAFlyoutHidden");
   //$(this.aFlyout).removeClass("birchAFlyoutShown");
  };
 
  p.show = function() {
   $(this.aFlyout).removeClass("birchAFlyoutHidden");
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
    this.svgLine.id = "birchFlyoutLine"+this.unique;
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

  // root required only if it's the first and you haven't done a makeContainer yet
  p.initialize = function(label, root) {
    this.root = root;
    this.unique = Flyout.getNextId();
    this.build(label);
    this.setX(this.unique*20);
   
    //this.updatePosition();
    //this.show();
  };
 
 p.point = function() {
  if (this.target) {
    var rect = this.target.getBoundingClientRect();
    var left = rect.left;
    var top = rect.top;
    var width = rect.width;
    var height = rect.height;

    var me = $(Flyout.getContainer());

   // adapted from within.js   
   var myRect = me.get(0).getBoundingClientRect();
   var res = !( (myRect.top > top+height) || (myRect.top +myRect.height < top) || (myRect.left > left+width ) || (myRect.left+myRect.width < left));

     if(res) {
      this.show();
      this.setX(rect.left-20);
      this.setY(rect.top-20);
      var theX = left;
      var theY = top;
      
       $("#"+this.svgLine.id).attr({x1:this.x,
                                    y1:this.y,
                                    x2:theX,
                                    y2:theY});
      this.paintTarget();
     } else {
      this.hide();
      this.unpaintTarget();
     }
  } else {
   this.hide();
  }
 };
 
 p.doClick = function() {
  function clickOrFocus(element) {
    console.log(element);
    console.log(element.nodeName);
    var justFocus = {//"A":true,
                         "INPUT":true,
                         "TEXTAREA":true,
                         "SELECT":true,
                         "BUTTON":true//,
                         //"output":true,
                         //"command":true,
                         //"kbd":true
                         };
    
    if (justFocus[element.nodeName]) {
      element.focus();
    } else {
      element.click();
    }
  }
  if (this.target) {
   $(this.target).addClass("cluck");
   clickOrFocus(this.target);
  }
 };
 
 p.paintTarget = function() {
  if (this.target) {
   $(this.target).addClass("birchPainted");
  }
 };
 
 p.unpaintTarget = function() {
  if (this.target) {
   $(this.target).removeClass("birchPainted");
  }
 };
 
 p.unsetTarget = function() {
  this.unpaintTarget();
  this.target = false;
 };
 
 p.setTarget = function(element, coordsyst) {
  /*if (element == null) {
   $("#"+this.svgLine.id).attr({x2:0,
                    y2:0});
   return;
  }*/
  this.unsetTarget();
  this.target = element;
  this.point();
  
  /*var rect2 = coordsyst.getBoundingClientRect();
  var pX = theX*100/rect2.width;
  var pY = theY*100/rect2.height;*/
  
  /*$(this.svgLine).attr({x2:theX,
                    y2:theY});
  $(this.svgLine).attr({id:"hey"});
    //$(this.lineDiv).html($(this.lineDiv).html());
  $(this.lineDiv).html($(this.lineDiv).html());*/
 };

  birchlabs.Flyout = Flyout;
})();
  
});