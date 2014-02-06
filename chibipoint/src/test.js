define(["lib/jquery-2.1.0.min", "trace", "lookup", "testonly"], function (jq, tracer, lookup, testonly) {
  var trace = tracer.trace;
  
  window.birchlabs = window.birchlabs||{};
  var birchlabs = window.birchlabs;
  
  //console.log(birchlabs);
  
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
    
    birchlabs.Grid = Grid;
  })();
  
  var grid = new birchlabs.Grid();
  
  (function() {
    var Crosshairs = function(root, x, y) {
      this.initialize(root, x, y);
    };
    
    var p = Crosshairs.prototype;
    
    p.setX = function(x) {
      this.x = x;
      $(".verticalHair").first().css({left:x});
    };
    
    p.setY = function(y) {
      this.y = y;
      $(".horizontalHair").first().css({top:y});
    };
    
    p.show = function() {
      this.hairs.className = "shownCrosshairs";
    };
    p.hide = function() {
      this.hairs.className = "hiddenCrosshairs";
    };
    
    p.createCrosshairs = function(root) {
      this.hairs = document.createElement('div');
      
      this.horizontalHair = document.createElement('div');
      this.horizontalHair.className = "horizontalHair";
      
      this.verticalHair = document.createElement('div');
      this.verticalHair.className = "verticalHair";
      
      $(this.hairs).append(this.horizontalHair);
      $(this.hairs).append(this.verticalHair);
    
      $(root).append(this.hairs);
    };
    
    p.initialize = function(root, x, y) {
      this.createCrosshairs(root);
      this.setX(x);
      this.setY(y);
      this.show();
    };
    
    birchlabs.Crosshairs = Crosshairs;
  })();
  
  function init() {
    var keycodes = {
      "backspace": 8,
      "tab": 9,
      "enter": 13,
      "spacebar": 32,
      "escape": 27,
      "n": 78,
      "p": 80,
      "g": 71,
      "f3": 114,
      "f4": 115,
      "dot": 46,
      "zero": 48,
      "activate": 167
    };
    
    var numpadtype = true;
    var numpadstart = 48;
    
    //createGrid();
      function setEvents(rootNode) {
          var doc = rootNode.contentDocument || rootNode;
          var body = rootNode.body;
          
          if (!body || !body.addEventListener) {
              return;
          }
          
          lookup.setAlternativeActiveDocument(document);
        
          
        if (document.getElementById("chibipointtestmode") != null) {
          birchlabs.testmode = true;
        }
        
        trace(birchlabs.testmode);
        
          // usually on keydown
          //processSearch();
          //draw();
        var container = makeGridContainer(document.documentElement);
        var crosshairs;
        
        if (birchlabs.testmode) {
          createGrid(container);
        
          var finalGrid = $(grid.getLatestSelector()+" .grid").first();
          var coords = findPointerCoords(finalGrid);
          var centerX = coords.centerX;
          var centerY = coords.centerY;
          
          crosshairs = crosshairs||new birchlabs.Crosshairs(document.documentElement, centerX, centerY);
          crosshairs.show();
        }
        
        doc.addEventListener('keypress', function(ev) {
        if (lookup.isInputElementActive(doc)) {
          return;
        }
        var code = ev.keyCode;
        var ascii = String.fromCharCode(code);
          
        if (!lookup.is_shortcut(ev) && ascii && [keycodes.enter].indexOf(code) == -1) {
          var tracer = doc.getElementById("trace");
          if (tracer != null) {
            doc.getElementById("trace").innerHTML = code;
          }
          
          if (numpadtype) {
            var num = code-numpadstart;
            if (num<10 && num > 0) {
              if (tracer != null) {
                doc.getElementById("trace").innerHTML += ", " + (code-numpadstart);
              }
              
              trace($(grid.getLatestSelector()+" .grid").get(0));
              
              $(grid.getLatestSelector()+" .cell").text("");
              $(grid.getLatestSelector()+" .grid").css({"border-color": "#C1E0FF", 
               "border-width":"0px", 
               "border-style":"solid"});
              $(grid.getLatestSelector()+" .cell").css({"border-color": "#C1E0FF", 
               "border-width":"0px", 
               "border-style":"solid"});
              
              var rowIndexed1 = 4-Math.ceil(num/3);
              var columnIndexed1 = ((num-1)%3)+1;
              //cell.innerHTML = 7-(i*3-p);
              
              selectArray = [];
              selectArray.push(grid.getLatestSelector());
              selectArray.push(".grid");
              selectArray.push(".row:nth-of-type("+rowIndexed1+")");
              selectArray.push(".cell:nth-of-type("+columnIndexed1+")");
              grid.pushHistory(selectArray.join(" "));
              
              createGrid($(grid.getLatestSelector()).first());
              
              // move crosshairs
              var finalGrid = $(grid.getLatestSelector()+" .grid").first();
              var coords = findPointerCoords(finalGrid);
              var centerX = coords.centerX;
              var centerY = coords.centerY;
              
              crosshairs.setX(centerX);
              crosshairs.setY(centerY);
              
              console.log("not zero");
            } else if (code == keycodes.zero) {
              console.log("zero");
              // remove a grid!
              $(grid.getLatestSelector()).empty();
              grid.getPreviousSelector();
              
              trace(grid.getLatestSelector());
              
              var anticipatedHeight = $(grid.getLatestSelector()).height();
              var cellHeight = anticipatedHeight/3;
              $(grid.getLatestSelector()+" .grid .row").each(function(index) {
                  var i = index;
                  $(this).children().each(function(index) {
                    var p = index;
                    if (cellHeight>12) {
                      $(this).text(7-(i*3-p));
                      
                      var trans = document.createElement('div');
                      trans.className = "backing";
                      $(this).append(trans);
                    }
                  });
              });
              
              $(grid.getLatestSelector()+" .grid").css({"border-color": "#ccc", 
               "border-width":"1px 0 0 1px", 
               "border-style":"solid"});
              $(grid.getLatestSelector()+" .cell").css({"border-color": "#ccc", 
               "border-width":"0 1px 1px 0", 
               "border-style":"solid"});
              
              var exists = $(grid.getLatestSelector()+" .grid").length>0;
              if (exists) {
                // move crosshairs
                var finalGrid = $(grid.getLatestSelector()+" .grid").first();
                var coords = findPointerCoords(finalGrid);
                var centerX = coords.centerX;
                var centerY = coords.centerY;
                
                crosshairs.setX(centerX);
                crosshairs.setY(centerY);
              } else {
                crosshairs.hide();
              }
            }
          }
          if (code == keycodes.dot) {
            var finalGrid = $(grid.getLatestSelector()+" .grid").first();
            var coords = findPointerCoords(finalGrid);
            var centerX = coords.centerX;
            var centerY = coords.centerY;
            
            var rootNodes = [window].concat(lookup.getRootNodes());
            for (var i = 0; i < rootNodes.length; i++) {    
              var doc2 = rootNodes[i].document || rootNodes[i].contentDocument;
              if (!doc2 || !doc2.body)
                continue;
              
            
              var element = $(doc2.elementFromPoint(centerX, centerY)).get(0);
              
              console.log(element);
              
              element.click();
            }
          } else if (code == keycodes.activate) {
            if ($(".gridContainer").children().length == 0) {
              // need to make a grid
              grid.initialize();
              createGrid(container);
              
              // move crosshairs
              var finalGrid = $(grid.getLatestSelector()+" .grid").first();
              var coords = findPointerCoords(finalGrid);
              var centerX = coords.centerX;
              var centerY = coords.centerY;
              
              crosshairs = crosshairs||new birchlabs.Crosshairs(document.documentElement, centerX, centerY);
              
              crosshairs.setX(centerX);
              crosshairs.setY(centerY);
              
              crosshairs.show();
            } else {
              // toggle grid off
              grid.initialize();
              $(grid.getLatestSelector()).empty();
              
              crosshairs.hide();
            }
          }
          lookup.stopEvent(ev);
        }
      }, false);
      }
      
      // guess this defers setting events until root is loaded?
      var rootNodes = [document].concat(lookup.getRootNodes());
      for (var i = 0; i < rootNodes.length; i++) {
      var rootNode = rootNodes[i];
      if (rootNode.contentDocument) { 
        rootNode.addEventListener('load', function(ev) {
          setEvents(ev.target.contentDocument);
        });
      }
      else if (!rootNode.contentDocument || rootNode.contentDocument.readyState == 'complete') {
        setEvents(rootNode.contentDocument ? rootNode.contentDocument : rootNode);
      }
    }
      //draw();
  }
  
  function findPointerCoords(gridElement) {
    // click
    var offset = gridElement.offset();
    //console.log($this.get(0));
    //console.log($this.offset());
    var width = gridElement.outerWidth();
    var height = gridElement.outerHeight();
    
    var centerX = offset.left + width / 2;
    var centerY = offset.top + height / 2;
    
    console.log("x: "+centerX+" y: "+centerY);
    
    return {centerX:centerX, centerY:centerY};
  }
  
  function makeGridContainer(root) {
    var parent = document.createElement('div');
    parent.className = 'gridContainer';
    $(root).append(parent);
    return parent;
  }
  
  function createGrid(root) {
    
    var anticipatedHeight = $(root).height();
    var cellHeight = anticipatedHeight/3;
    // do not display text smaller than 12px
    // which on a low-density monitor is 12pt
      
    console.log(anticipatedHeight);
      
      var parent = document.createElement('div');
      parent.className = 'grid';
  
      for (var i = 0; i < 3; i++) {
          var row = document.createElement('div');
          row.className = 'row';
          for (var p = 0; p < 3; p++) {
              var cell = document.createElement('div');
              cell.className = "cell";
              if (cellHeight>12) {
                cell.innerHTML = 7-(i*3-p);
                cell.style.fontSize =Math.min(96,cellHeight*0.5)+"px"
                var trans = document.createElement('div');
                trans.className = "backing";
                cell.appendChild(trans);
              }
              row.appendChild(cell);
          }
          parent.appendChild(row);
      }
  
      //root.appendChild(parent);
    $(root).append(parent);
  }
    return { init: init,
             createGrid: createGrid};
  });