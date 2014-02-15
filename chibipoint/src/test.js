define(["lib/jquery-2.1.0.min", "lib/within", "trace", "lookup", "testonly", "Grid", "Crosshairs", "Flyout"], function (jq, within, tracer, lookup, testonly, gridclass, crosshairclass, flyout) {
  var trace = tracer.trace;
  var supertrace = tracer.supertrace;
  
  window.birchlabs = window.birchlabs||{};
  var birchlabs = window.birchlabs;
  
  //console.log(birchlabs);
  
  function makeContainers() {
    var Flyout = birchlabs.Flyout;
    var Grid = birchlabs.Grid;
    var Crosshairs = birchlabs.Crosshairs;
    
    Flyout.makecontainer(document.documentElement);
    var flyouts = [];

    var grid = new Grid();
    var container = makeGridContainer(document.documentElement);
    
    var crosshairs = new Crosshairs(document.documentElement, grid);
    crosshairs.hide();
    
    birchlabs.grid = grid;
    birchlabs.container = container;
    birchlabs.crosshairs = crosshairs;
    //birchlabs.theFlyout = flyout;
    birchlabs.flyouts = flyouts;
  }
  
  function init() {
    makeContainers();
    var Flyout = birchlabs.Flyout;
    var Grid = birchlabs.Grid;
    var Crosshairs = birchlabs.Crosshairs;
    
    var flyouts = birchlabs.flyouts;
    var grid = birchlabs.grid;
    var crosshairs = birchlabs.crosshairs;
    
    birchlabs.targetedElement = null;
    
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
    
    // qwerty grid
    /*var flyoutShortcuts = [113,119,101,
                          97,115,100,
                          122,120,99];*/
    // dvorak grid
    var flyoutShortcuts = [39,44,46,
                          97,111,101,
                          59,113,106];
    // alphabet grid
    /*var flyoutShortcuts = [97,98,99,
                          100,101,102,
                          103,104,105];*/
    
    for (var i=0; i<flyoutShortcuts.length; i++) {
      flyouts.push(new Flyout(flyoutShortcuts[i]));
    }
    
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
        
        //trace(birchlabs.testmode);
        
          // usually on keydown
          //processSearch();
          //draw();
        //var container = birchlabs.container;
        
        if (birchlabs.testmode) {
          toggleGrid();          
        }
        
        var $window   = $(window),
            resize_ok = true,
            timer;

        timer = setInterval(function () {
            resize_ok = true;
        }, 50);
        
        liveTargeter = function() {
          if (resize_ok === true) {
                resize_ok = false;
                //trace($window.width());
              //trace($(".verticalHair").first().offset().left);
              //highlightTarget();
            crosshairs.highlight(getDocRoot());
              pointFlyouts();
            }
        };

        $window.resize(liveTargeter);
        $window.scroll(liveTargeter);
        
        // some keys can only be caught by keydown
        doc.addEventListener('keydown', function(ev) {
          var code = ev.keyCode;
          var ascii = String.fromCharCode(code);
          
          if (code == keycodes.enter) {
            gridclick(grid);
            
            lookup.stopEvent(ev);
          }
        });
        
        doc.addEventListener('keypress', function(ev) {
        if (lookup.isInputElementActive(doc)) {
          var tracer = doc.getElementById("trace");
          if (tracer != null) {
            doc.getElementById("trace").innerHTML = code;
          }
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
              if (gridIsInUse()) {
                drill(num, grid, crosshairs);
                
                lookup.stopEvent(ev);
              }
            } else if (code == keycodes.zero) {
              backup(grid, crosshairs);
            
              lookup.stopEvent(ev);
            }
          }
          if (code == keycodes.dot) {
            gridclick(grid);
            
            lookup.stopEvent(ev);
          } else if (code == keycodes.activate) {
            toggleGrid();
            
            lookup.stopEvent(ev);
          }
          for (i=0; i<flyoutShortcuts.length; i++) {
            if (code == flyoutShortcuts[i]) {
              flyouts[i].doClick();
              closeGrid();
            }
            lookup.stopEvent(ev);
          }
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
  
  function getDocRoot() {
    var rootNodes = [window].concat(lookup.getRootNodes());
    for (var x = 0; x < rootNodes.length; x++) {
      var doc2 = rootNodes[x].document || rootNodes[x].contentDocument;
      if (!doc2 || !doc2.body)
        continue;
      return doc2;
    }
  }
  
  function getAllClickablesInBoundsAndSort(root, rect, rects) {
      var found = [];
      var buckets = [];
      for (var j=0; j<rects.length; j++) {
        buckets.push([]);
      }

      var left = rect.left;
      var top = rect.top;
      var width = rect.width;
      var height = rect.height;

      var left2;
      var top2;
      var width2;
      var height2;

      var cache = false;

      var r;
      var i;
      var res;
      var res2;
      //var q;
      //var ew;
      var itRect;

      $(root).find("[_handlerTypes], A, INPUT, SELECT, TEXTAREA, BUTTON").each(function() {

        if(this == document.documentElement) return  this.ret.push(this);

        itRect = this.getBoundingClientRect();

        res = !( (itRect.top > top+height) || (itRect.top +itRect.height < top) || (itRect.left > left+width ) || (itRect.left+itRect.width < left));

      // it's certainly in the grid somewhere
        if(res) {

          // now find which buckets to put it in
            for (i=0; i<rects.length; i++) {
              r = rects[i];
              left2 = r.left;
              top2 = r.top;
              width2 = r.width;
              height2 = r.height;

              res2 =  !( (itRect.top > top2+height2) || (itRect.top +itRect.height < top2) || (itRect.left > left2+width2 ) || (itRect.left+itRect.width < left2));

              if (res2) {
                buckets[i].push(this);
              }
            }
        }
      });
      return buckets;
    }
  
  function highlightTarget() {
    var crosshairs = birchlabs.crosshairs;
    var flyouts = birchlabs.flyouts;
    var grid = birchlabs.grid;
    
    var doc2 = getDocRoot();
      
      var crosshaired = crosshairs.highlight(doc2).get(0);
      
      // some of the obscure ones are guesses
      var careElements = {"A":true,
                         "INPUT":true,
                         "TEXTAREA":true,
                         "SELECT":true,
                         "BUTTON":true//,
                         //"output":true,
                         //"command":true,
                         //"kbd":true
                         };
          
      var rect = grid.getLastGrid().get(0).getBoundingClientRect();
      
      var rects = [];
      for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
          rects.push(grid.getLastRows().eq(i).children().eq(j).get(0).getBoundingClientRect());
        }
      }
      var buckets =getAllClickablesInBoundsAndSort($(doc2.body), rect, rects);
      
      // which element was selected by each segment
      var selected = [];
    //console.log(crosshaired);
      
      var bucketIndex = 0;
      // one bucket for each segment
      for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
          var fulfilled = false;
          for (var b=0; b<buckets.length; b++) {
            // check everything in my allocated bucket first
            // but be prepared to cycle round to another bucket!
            var myBucket = buckets[(bucketIndex+b)%buckets.length];
            for (var n = 0; n<myBucket.length; n++) {
              var inSelectedAlready = false;
              if (myBucket[n] != crosshaired) {
                for (var s = 0; s<selected.length; s++) {
                  // skip over 
                  if (selected[s] == myBucket[n])
                  {
                    inSelectedAlready = true;
                    break;
                  }
                }
                if (!inSelectedAlready) {
                  // add to selected
                  selected[bucketIndex] = myBucket[n];
                  fulfilled = true;
                  break;
                }
              }
            }
            if (fulfilled) {
              break;
            }
          }
          bucketIndex++;
        }
      }
      
      for (var i=0; i<flyouts.length; i++) {        
        var f = flyouts[i];
        var targ = selected[i];
        f.unsetTarget();
        f.hide();
        if (targ) {
          f.setTarget(targ, grid.getFirstGrid().get(0));
        }
      }
      var delayPoint = setInterval(function () {
          clearInterval(delayPoint);
          for (var i=0; i<flyouts.length; i++) {
            var f = flyouts[i];
            var targ = selected[i];
            if (targ) {
              f.show();
            }
          }
        pointFlyouts();
        }, 50);
      //trace(selected);
  }
  
  function unpointFlyouts() {
    var flyouts = birchlabs.flyouts;
    
    for (var i=0; i<flyouts.length; i++) {
        var f = flyouts[i];
        f.unsetTarget();
        f.hide();
      }
  }
  
  function pointFlyouts() {
    var flyouts = birchlabs.flyouts;
    
    for (var i=0; i<flyouts.length; i++) {
        var f = flyouts[i];
        f.point();
      }
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
      
      var parent = document.createElement('div');
      parent.className = 'grid gridBorderOn';
  
      for (var i = 0; i < 3; i++) {
          var row = document.createElement('div');
          row.className = 'row';
          for (var p = 0; p < 3; p++) {
              var cell = document.createElement('div');
              cell.className = "cell cellBorderOn";
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
  
  function drill(num, grid, crosshairs) {
    var Flyout = birchlabs.Flyout;
    
    grid.getLastCells().text("");
    grid.getLastGrid().addClass("gridBorderOff");
    grid.getLastCells().addClass("cellBorderOff");
    grid.getLastGrid().removeClass("gridBorderOn");
    grid.getLastCells().removeClass("cellBorderOn");

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
    crosshairs.updatePosition(grid);
    highlightTarget();
    
    Flyout.show();
  }
  
  function backup(grid, crosshairs) {
    var Flyout = birchlabs.Flyout;
    
    // remove a grid!
    $(grid.getLatestSelector()).empty();
    grid.getPreviousSelector();

    //trace(grid.getLatestSelector());

    var anticipatedHeight = $(grid.getLatestSelector()).height();
    var cellHeight = anticipatedHeight/3;
    grid.getLastRows().each(function(index) {
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

    grid.getLastGrid().removeClass("gridBorderOff");
    grid.getLastCells().removeClass("cellBorderOff");
    grid.getLastGrid().addClass("gridBorderOn");
    grid.getLastCells().addClass("cellBorderOn");

    unpointFlyouts();
    
    var exists = grid.getLastGrid().length>0;
    if (exists) {
      // move crosshairs
      crosshairs.updatePosition(grid);
      highlightTarget();
      Flyout.show();
    } else {
      Flyout.hide();
      crosshairs.hide();
    }
  }
  
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
    closeGrid();
  }
  
  function gridclick(grid) {
    var coords = grid.findPointerCoords();
    var centerX = coords.centerX;
    var centerY = coords.centerY;

    var rootNodes = [window].concat(lookup.getRootNodes());
    for (var i = 0; i < rootNodes.length; i++) {    
      var doc2 = rootNodes[i].document || rootNodes[i].contentDocument;
      if (!doc2 || !doc2.body)
        continue;


      var element = $(doc2.elementFromPoint(centerX, centerY));

      element.removeClass("targeted");
      element.addClass("cluck");
      
      clickOrFocus(element.get(0));
      //element.get(0).click();
      
      var delayUnclick = setInterval(function () {
          clearInterval(delayUnclick);
          element.removeClass("cluck");
        pointFlyouts();
        }, 50);
    }
  }
  
  function shortcut() {
    toggleGrid();
  }
  
  function toggleGrid() {
    var Flyout = birchlabs.Flyout;
    
    var crosshairs = birchlabs.crosshairs;
    var container = birchlabs.container;
    var grid = birchlabs.grid;
    
    document.activeElement.blur();
    //document.documentElement.focus();
    
    if (gridIsEmpty()) {
      // need to make a grid
      grid.initialize();
      createGrid(container);

      //crosshairs = crosshairs||new birchlabs.Crosshairs(document.documentElement, grid);
      //birchlabs.crosshairs = crosshairs;

      // in case crosshairs already instantiated
      crosshairs.updatePosition(grid);
      highlightTarget();
      crosshairs.show();
      Flyout.show();
    } else {
      // toggle grid off
      closeGrid();
    }
  }
  
  function closeGrid() {
    var Flyout = birchlabs.Flyout;
    
    var crosshairs = birchlabs.crosshairs;
    var grid = birchlabs.grid;
    
    grid.initialize();
    $(grid.getLatestSelector()).empty();

    unpointFlyouts();
    Flyout.hide();
    crosshairs.hide();
  }
  
  function gridIsEmpty() {
    return $(".gridContainer").children().length == 0;
  }
  
  function gridIsInUse() {
    //var grid = birchlabs.grid;
    return $(".grid").children().length > 0;
  }
  
    return { init: init,
             createGrid: createGrid,
           shortcut: shortcut};
  });