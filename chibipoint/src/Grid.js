define(["lib/jquery-2.1.0.min", "lib/within"], function(jq, within) {

window.birchlabs = window.birchlabs||{};
var birchlabs = window.birchlabs;

(function(){
  var Grid = function() {
    this.initialize();
  }
  var p = Grid.prototype;

  p.initialize = function() {
      this.selectHistory = [".gridContainer"];
  };

  p.getLatestSelector = function() {
    return this.selectHistory[this.selectHistory.length-1];
  }

  p.getPreviousSelector = function() {
    if (this.selectHistory.length>1) {
      this.selectHistory.pop(this.selectHistory.length-1);
    }
    return this.getLatestSelector();
  }

  p.pushHistory = function(input) {
    this.selectHistory.push(input);
  }

  p.exists = function() {
    return this.selectHistory.length>1;
  }

  p.getLastRows = function() {
    return $(this.getLatestSelector()+" .row");
  };

  p.getLastCells = function() {
    return $(this.getLatestSelector()+" .cell");
  };

  p.getLastGrid = function() {
    return $(this.getLatestSelector()+" .grid").first();
  };

  p.getFirstGrid = function() {
    return $(this.selectHistory[0]+" .grid").first();
  };
 
  p.findPointerCoords = function() {
    var element = this.getLastGrid();
    // click
    //var offset = gridElement.offset();
    var offset = element.get(0).getBoundingClientRect();
    //console.log($this.get(0));
    //console.log($this.offset());
    var width = element.outerWidth();
    var height = element.outerHeight();
    
    var centerX = offset.left + width / 2;
    var centerY = offset.top + height / 2;
    
    //console.log("x: "+centerX+" y: "+centerY);
    
    return {centerX:centerX, centerY:centerY};
  };

  birchlabs.Grid = Grid;
})();
  
});