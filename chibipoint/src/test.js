define(["lib/jquery-2.1.0.min", "lib/within", "trace", "lookup", "testonly", "Grid", "Crosshairs", "Flyout"], function (jq, within, tracer, lookup, testonly, gridclass, crosshairclass, flyout) {
  var trace = tracer.trace;
  var supertrace = tracer.supertrace;
  
  window.birchlabs = window.birchlabs||{};
  var birchlabs = window.birchlabs;
  
  //console.log(birchlabs);
  
  var grid = new birchlabs.Grid();
  var flyout = new birchlabs.Flyout(document.documentElement, "A");
  
  birchlabs.theGrid = grid;
  birchlabs.theFlyout = flyout;
  
  function init() {
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
        var container = makeGridContainer(document.documentElement);
        var crosshairs;
        
        if (birchlabs.testmode) {
          createGrid(container);
          
          crosshairs = crosshairs||new birchlabs.Crosshairs(document.documentElement, grid);
          highlightTarget();
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
              highlightTarget();
            
            }
        };

        //$window.resize(liveTargeter);
        //$window.scroll(liveTargeter);
        
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
              
              drill(num, grid, crosshairs);
              
              lookup.stopEvent(ev);
            } else if (code == keycodes.zero) {
              backup(grid, crosshairs);
            
              lookup.stopEvent(ev);
            }
          }
          if (code == keycodes.dot) {
            gridclick(grid);
            
            lookup.stopEvent(ev);
          } else if (code == keycodes.activate) {
            if ($(".gridContainer").children().length == 0) {
              // need to make a grid
              grid.initialize();
              createGrid(container);
              
              crosshairs = crosshairs||new birchlabs.Crosshairs(document.documentElement, grid);
              
              // in case crosshairs already instantiated
              crosshairs.updatePosition(grid);
              highlightTarget();
              crosshairs.show();
            } else {
              // toggle grid off
              grid.initialize();
              $(grid.getLatestSelector()).empty();
              
              crosshairs.hide();
              removeHighlights();
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
  
  function highlightTarget() {
    var coords = grid.findPointerCoords();
    var centerX = coords.centerX;
    var centerY = coords.centerY;
    
    var rootNodes = [window].concat(lookup.getRootNodes());
    for (var x = 0; x < rootNodes.length; x++) {
      var doc2 = rootNodes[x].document || rootNodes[x].contentDocument;
      if (!doc2 || !doc2.body)
        continue;


      var element = $(doc2.elementFromPoint(centerX, centerY));

      //console.log(element.get(0));
      
      //trace(birchlabs.targetedElement);

      // unhighlight previous element
      removeHighlights();
      birchlabs.targetedElement = element;
      
      element.addClass("targeted");
      
      flyout.setTarget(element.first().get(0), grid.getFirstGrid().get(0));
      
      /*grid.getLastRows().each(function(index) {
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
    });*/
      
      //supertrace(rect);
      
      //trace($(grid.getLastGrid()).get(0).innerText);
      //$(doc2.body).find("*").withinBox(rect.left, rect.top, rect.width, rect.height).each(function() {trace( $(this).get(0))});
      //trace(getEventListeners(element.first().get(0)));
      
      //trace(element.first().get(0).getAttribute("_handlerTypes"));
      
      //var worker = new Worker('task.js');
      
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
      
      function findElementsInRect(rect, root) {
        var found = [];
        $(root).children().withinBox(rect.left, rect.top, rect.width, rect.height, true).each(
          function() {
            //console.log($(this));
            found.push($(this));
            // continue search within me
            found = found.concat(findElementsInRect(rect, $(this)));
          });
        return found;
      };
      
      function findClickables(potentials) {
        var filtered = [];
        var p;
        for (var i in potentials) {
          p = potentials[i].get(0);
          if (p.getAttribute("_handlerTypes") != null ||
               careElements[p.nodeName]) {
            filtered.push(p);
          }
        }
        return filtered;
      }
      
      /*var buckets = [];
      
      for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
          var myBucket = [];
          
          var rect = grid.getLastRows().eq(i).children().eq(j).get(0).getBoundingClientRect();

          $(doc2.body).find("*").withinBox(rect.left, rect.top, rect.width, rect.height, true).each(function() {
            var myElement = $(this).get(0);
            if (myElement.getAttribute("_handlerTypes") != null ||
               careElements[myElement.nodeName]) {
              myBucket.push(myElement);
              //trace(myElement);
            }
          });
          buckets.push(myBucket);
        }
      }*/
      
      var rect = grid.getLastRows().eq(0).children().eq(0).get(0).getBoundingClientRect();
      
      function getAllClickables(root) {
        return $(root).find("[_handlerTypes], A");
      }
      function getAllClickablesInBounds(root, rect) {
        return $(root).find("[_handlerTypes], A, INPUT, SELECT, TEXTAREA, BUTTON").withinBox(rect.left, rect.top, rect.width, rect.height, true);
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
        var q;
        var ew;
        
        $(root).find("[_handlerTypes], A, INPUT, SELECT, TEXTAREA, BUTTON").each(function() {
          
          //var ret = []
          q = $(this);

          if(this == document.documentElement) return  this.ret.push(this);

          var offset = cache ? 
              $.data(this,"offset") || 
              $.data(this,"offset", q.offset()) : 
              q.offset();


          ew = q.width(), eh = q.height();
          
          //console.log(offset);
          // false, false, false, false
          res =  !( (offset.top > top+height) || (offset.top +eh < top) || (offset.left > left+width ) || (offset.left+ew < left));
        
        // it's certainly in the grid somewhere
          if(res) {
            
            // now find which buckets to put it in
              //ret.push(this);
            
              for (i=0; i<rects.length; i++) {
                r = rects[i];
                left2 = r.left;
                top2 = r.top;
                width2 = r.width;
                height2 = r.height;

                res2 =  !( (offset.top > top2+height2) || (offset.top +eh < top2) || (offset.left > left2+width2 ) || (offset.left+ew < left2));
                
                
          //if (i == 8 && this.href=="http://www.metanetsoftware.com/technique/tutorialA.html") {
            /*console.log(offset);
            console.log(ew);
            console.log(eh);
            console.log(rect);*/
            //console.log(res2);
            /*console.log(offset.top > top2+height2);
            console.log(offset.top +eh < top2);
            console.log(offset.left > left+width2 );
            console.log(offset.left+ew < left2);*/
            /*console.log(offset.left);
            console.log(left);
            console.log(width2 );
            console.log(left+width2 );*/
          //}

                if (res2) {
                  buckets[i].push(this);
                }
              }
          }
        });
        return buckets;
      }
      
      //getAllClickables($(doc2.body));
      
      //var them = getAllClickablesInBounds($(doc2.body), rect);
      //console.log(them.length);
      
      /*for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
          var rect = grid.getLastRows().eq(i).children().eq(j).get(0).getBoundingClientRect();

          var potentials = findElementsInRect(rect, $(doc2.body));
          //console.log(potentials.length);
          var myBucket = findClickables(potentials);
          //console.log(myBucket);
          
          buckets.push(myBucket);
        }
      }*/
      
      //var buckets = [];
      
      //i=0;
      //j=0;
      var rect = grid.getLastGrid().get(0).getBoundingClientRect();
      
      var rects = [];
      for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
          rects.push(grid.getLastRows().eq(i).children().eq(j).get(0).getBoundingClientRect());
        }
      }

      //console.log(getAllClickablesInBounds($(doc2.body), rect));
      var buckets =getAllClickablesInBoundsAndSort($(doc2.body), rect, rects);
      
      //console.log(buckets);

      //buckets.push(myBucket);
      
      // which element was selected by each segment
      var selected = [];
      
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
            if (fulfilled) {
              break;
            }
          }
          bucketIndex++;
        }
      }
      //trace(selected);
    }
  }
  
  function removeHighlights() {
    if (birchlabs.targetedElement != null) {
        birchlabs.targetedElement.removeClass("targeted");
        birchlabs.targetedElement.removeClass("cluck");
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
  }
  
  function backup(grid, crosshairs) {
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

    var exists = grid.getLastGrid().length>0;
    if (exists) {
      // move crosshairs
      crosshairs.updatePosition(grid);
      highlightTarget();
    } else {
      crosshairs.hide();
      removeHighlights();
    }
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
      element.get(0).click();
    }
  }
  
    return { init: init,
             createGrid: createGrid};
  });