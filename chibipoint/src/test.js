define(["lib/jquery-2.1.0.min", "lib/within", "lib/Blob", "lib/FileSaver", "trace", "lookup", "testonly", "Grid", "Crosshairs", "Flyout"], function (jq, within, blob, saver, tracer, lookup, testonly, gridclass, crosshairclass, flyout) {
  var trace = tracer.trace;
  var supertrace = tracer.supertrace;
  
  window.birchlabs = window.birchlabs||{};
  var birchlabs = window.birchlabs;
  
  window.evaluator = window.evaluator||{};
  var evaluator = window.evaluator;
  
  //console.log(birchlabs);
  
  function makeContainers() {
    var Flyout = birchlabs.Flyout;
    var Grid = birchlabs.Grid;
    var Crosshairs = birchlabs.Crosshairs;
    
    if (birchlabs.flyoutsOn) {
      Flyout.makecontainer(document.documentElement);
      var flyouts = [];
    }
    Flyout.hide();

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
  
  function makeEvaluators() {    
    var keyCountElem = makeKeyCount(document.documentElement);
    var timerElem = makeTimer(document.documentElement);
    
    var keys = "";
    var times = "";
    var timeDeltas = "";
    var timesHuman = "";
    var timeDeltasHuman = "";
    var keyCount = 0;
    var timer = new Date().getTime();
    var totalTime = 0;
    
    evaluator.keys = keys;
    evaluator.times = times;
    evaluator.timeDeltas = timeDeltas;
    evaluator.timesHuman = timesHuman;
    evaluator.timeDeltasHuman = timeDeltasHuman;
    evaluator.keyCount = keyCount;
    evaluator.timer = timer;
    evaluator.totalTime = 0;
    
    evaluator.keyCountElem = keyCountElem;
    evaluator.timerElem = timerElem;
    
    drawEvaluators();
  }
  
  function init() {
    birchlabs.evaluateTabMode = false;
    birchlabs.flyoutsOn = true;
    if (birchlabs.evaluateTabMode) {
      birchlabs.flyoutsOn = false;
    }
    makeContainers();
    makeEvaluators();
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
    
    var numpad = true;
    
    if (numpad) {
      // numpad
      var numpadMappings = {"7":[55,7], "8":[56,8], "9":[57,9],
                         "4":[52,4], "5":[53,5], "6":[54,6],
                         "1":[49,1], "2":[50,2], "3":[51,3]};
      var zeroKey = keycodes.zero;
    }
    
    var dvorak = false;
    
    if (dvorak) {
      // dvorak flyouts
      var flyoutShortcuts = [103,99,114,
                          104,116,110,
                          109,119,118];
      
      if (!numpad) {
        var numpadMappings = {"7":[39,7], "8":[44,8], "9":[46,9],
                           "4":[97,4], "5":[111,5], "6":[101,6],
                           "1":[59,1], "2":[113,2], "3":[106,3]};
        var zeroKey = 107;
      }
    } else {
      // qwerty flyouts
      var flyoutShortcuts = [113,119,101,
                          97,115,100,
                          122,120,99];
      
      // alphabet flyouts
      /*var flyoutShortcuts = [97,98,99,
                          100,101,102,
                          103,104,105];*/
      
      if (!numpad) {
      // left hand qwerty
        var flyoutShortcuts = [117,105,111,
                          106,107,108,
                          109,44,46];
        // qwerty grid    
        var numpadMappings = {"7":[113,7], "8":[119,8], "9":[101,9],
                           "4":[97,4], "5":[115,5], "6":[100,6],
                           "1":[122,1], "2":[120,2], "3":[99,3]};
        var zeroKey = 118;
      }
    }
    
    // numpad grid
    // I'm so sorry
    
    birchlabs.numpadMappings = numpadMappings;
    
    if (birchlabs.flyoutsOn) {
      for (var i=0; i<flyoutShortcuts.length; i++) {
        flyouts.push(new Flyout(flyoutShortcuts[i]));
      }
    }
    
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
            if (birchlabs.evaluateTabMode) {
              evaluatorWriteState(document.activeElement);
            } else {
              gridclick(grid);

              lookup.stopEvent(ev);
              evaluatorIncrementKeys(code);
            }
          }
          
          if (code == keycodes.tab) {
            if (birchlabs.evaluateTabMode) {
              // negative, for shift-tab!
              var code2 = ev.shiftKey ? -code : code;
              evaluatorIncrementKeys(code2);
            } else {
              alert("Please do not press tab during this experiment!");
              lookup.stopEvent(ev);
              document.activeElement.blur();
            }
          }
          /*if (code == keycodes.spacebar) {
            evaluatorIncrementKeys(code);
          }*/
          if (!birchlabs.evaluateTabMode) {
            if (code == keycodes.escape) {
              if (!gridIsEmpty()) {
                closeGrid();

                lookup.stopEvent(ev);
                evaluatorIncrementKeys(code);
              }
            }
          }
        });
        
        // no key bindings in tab mode
        if (!birchlabs.evaluateTabMode) {
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

            /*if (numpadtype) {
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
            }*/
            for (var j in numpadMappings) {
              if (code == numpadMappings[j][0]) {
                if (gridIsInUse()) {
                  drill(numpadMappings[j][1], grid, crosshairs);

                  lookup.stopEvent(ev);
                  evaluatorIncrementKeys(code);
                  break;
                }
              }
            }
            if (code == zeroKey) {
              backup(grid, crosshairs);

              lookup.stopEvent(ev);
              evaluatorIncrementKeys(code);
            }
            if (code == keycodes.activate) {
              toggleGrid();

              lookup.stopEvent(ev);
              evaluatorIncrementKeys(code);
            }
            if (birchlabs.flyoutsOn) {
              for (i=0; i<flyoutShortcuts.length; i++) {
                if (code == flyoutShortcuts[i]) {
                  evaluatorWriteState(flyouts[i].getTarget());
                  flyouts[i].doClick();
                  
                  closeGrid();

                  lookup.stopEvent(ev);
                  evaluatorIncrementKeys(code);
                  break;
                }
              }
            }
          }
        }, false);
        }
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
  
  function formatTime(time) {
      var ret = time % 1000 + ' ms';
      time = Math.floor(time / 1000);
      if (time !== 0) {
          ret = time % 60 + "s "+ret;
          time = Math.floor(time / 60);
          if (time !== 0) {
              ret = time % 60 + "min "+ret;
              time = Math.floor(time / 60);
              if (time !== 0) {
                  ret = time % 60 + "h "+ret;
              }
          }           
      }
      return ret;
  }
  
  function evaluatorWriteState(clickedElem) {    
    //var b = blob.Blob;
    //console.log(b);
    
    var endMilli = parseInt(evaluator.timer)+parseInt(evaluator.totalTime);
    
    var startDate = new Date(evaluator.timer);
    var endDate = new Date(endMilli);
    
    var output = "page: "+document.URL;
    output += "\n clicked: "+clickedElem;
    output += "\n startTime: "+evaluator.timer;
    output += "\n endTime: "+endMilli;
    output += "\n duration: "+evaluator.totalTime;
    output += "\n durationHuman: "+formatTime(evaluator.totalTime);
    output += "\n\n startDate: "+(startDate.toLocaleDateString() + " " + startDate.toLocaleTimeString());
    output += "\n endDate: "+(endDate.toLocaleDateString() + " " + endDate.toLocaleTimeString());
    output += "\n\n times: "+evaluator.times;
    output += "\n timesHuman: "+evaluator.timesHuman;
    output += "\n\n timeDeltas: "+evaluator.timeDeltas;
    output += "\n timeDeltasHuman: "+evaluator.timeDeltasHuman;
    output += "\n\n keyCount: "+evaluator.keyCount;
    output += "\n keys: "+evaluator.keys;
    
    output += "\n\n CHIBIPOINT ON: "+(!birchlabs.evaluateTabMode);
    output += "\n FLYOUTS ON: "+birchlabs.flyoutsOn;
    
    var finalElem = "\n\nClicked.. \n";
    for (var j in clickedElem) {
		finalElem += " "+ j + ": " + clickedElem[j] + "\n";
	}
    
    output += finalElem;
    
    var bb = new Blob([output]);
    console.log(bb);
    //bb.append((new XMLSerializer).serializeToString(document));
    //var blob = bb.getBlob("application/xhtml+xml;charset=" + document.characterSet);
    saver.saveAs(bb, "document.txt");
  }
  
  function evaluatorIncrementKeys(theKey) {
    var evaluator = window.evaluator;
    
    var nowTime = (new Date().getTime());
    var thisDelta = nowTime-(evaluator.timer+evaluator.totalTime);
    var wholeDelta = nowTime-evaluator.timer;
    
    evaluator.keyCount++;
    evaluator.keys += theKey+",";
    evaluator.times += nowTime+",";
    evaluator.timeDeltas += thisDelta+",";
    evaluator.timesHuman += formatTime(nowTime)+", ";
    evaluator.timeDeltasHuman += formatTime(thisDelta)+", ";
    evaluator.totalTime = wholeDelta;
    
    //evaluator.keyCountElem.innerHTML = keyCount;
    //evaluator.timerElem.innerHTML = timer;
    
    drawEvaluators();
  }
  
  function drawEvaluators() {
    var evaluator = window.evaluator;
    
    evaluator.keyCountElem.innerHTML = evaluator.keys;
    evaluator.timerElem.innerHTML = formatTime(evaluator.totalTime);
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

      $(root).find("[_handlerTypes], A, INPUT, SELECT, TEXTAREA, BUTTON").each(function() {
        var found = false;
        var handlers = this.getAttribute('_handlerTypes');
        if (handlers != null ) {
          var h = handlers.split(",");
          for (i=0; i<h.length; i++) {
            if (h[i] == 'click' || h[i] == 'mousedown') {
              found = true;
              break;
            }
          }
        }
        if (!found) {
          if(careElements[this.nodeName]) found = true;
        }
        if (found) {
          //if ($(this).css("visibility").indexOf("hidden") != -1 || !$(this).css("display").indexOf("none") != -1) return;
          var visible = !$(this).is(':hidden') && $(this).is(':visible');
          if (visible) {
            //if(this == document.documentElement) return  this.ret.push(this);
            if(this == document.documentElement) return;

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
      if (birchlabs.flyoutsOn) {
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
//      var delayPoint = setInterval(function () {
  //        clearInterval(delayPoint);
          for (var i=0; i<flyouts.length; i++) {
            var f = flyouts[i];
            var targ = selected[i];
            if (targ) {
              f.show();
            }
          }
        pointFlyouts();
      //  }, 50);
      //trace(selected);
    }
  }
  
  function unpointFlyouts() {
    if (birchlabs.flyoutsOn) {
      var flyouts = birchlabs.flyouts;
    
      for (var i=0; i<flyouts.length; i++) {
          var f = flyouts[i];
          f.unsetTarget();
          f.hide();
        }
    }
  }
  
  function pointFlyouts() {
    var grid = birchlabs.grid;
    
    if (birchlabs.flyoutsOn) {
      var flyouts = birchlabs.flyouts;

      for (var i=0; i<flyouts.length; i++) {
          var f = flyouts[i];
          f.point(grid.findPointerCoords());
        }
    }
  }
  
  function makeTimer(root) {
    var parent = document.createElement('div');
    parent.className = 'chibiPoint_timer';
    $(root).append(parent);
    return parent;
  }
  
  function makeKeyCount(root) {
    var parent = document.createElement('div');
    parent.className = 'chibiPoint_keyCount';
    $(root).append(parent);
    return parent;
  }
  
  function makeGridContainer(root) {
    var parent = document.createElement('div');
    parent.className = 'chibiPoint_gridContainer chibiPoint_hiddenGridContainer';
    $(root).append(parent);
    return parent;
  }
  
  function createGrid(root) {
    var numpadMappings = birchlabs.numpadMappings;
    
    var anticipatedHeight = $(root).height();
    var cellHeight = anticipatedHeight/3;
    // do not display text smaller than 12px
    // which on a low-density monitor is 12pt
      
      var parent = document.createElement('div');
      parent.className = 'chibiPoint_grid chibiPoint_gridBorderOn';
    
      var drawBorders = false;
      // if it's not too small, give it borders
      var rect = $(root).get(0).getBoundingClientRect();
      if (rect.width>60 && rect.height >60) {
        drawBorders = true;
      }
  
      for (var i = 0; i < 3; i++) {
          var row = document.createElement('div');
          row.className = 'chibiPoint_row';
          for (var p = 0; p < 3; p++) {
              var cell = document.createElement('div');
              if (drawBorders) {
                cell.className = "chibiPoint_cell chibiPoint_cellBorderOn";
              } else {
                cell.className = "chibiPoint_cell";
              }
            
              if (cellHeight>12) {
                cell.innerHTML = String.fromCharCode(numpadMappings[(7-(i*3-p)).toString()][0]).toUpperCase();
                cell.style.fontSize =Math.min(96,cellHeight*0.5)+"px"
                var trans = document.createElement('div');
                trans.className = "chibiPoint_backing";
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
    grid.getLastGrid().addClass("chibiPoint_gridBorderOff");
    grid.getLastCells().addClass("chibiPoint_cellBorderOff");
    grid.getLastGrid().removeClass("chibiPoint_gridBorderOn");
    grid.getLastCells().removeClass("chibiPoint_cellBorderOn");

    var rowIndexed1 = 4-Math.ceil(num/3);
    var columnIndexed1 = ((num-1)%3)+1;
    //cell.innerHTML = 7-(i*3-p);

    selectArray = [];
    selectArray.push(grid.getLatestSelector());
    selectArray.push(".chibiPoint_grid");
    selectArray.push(".chibiPoint_row:nth-of-type("+rowIndexed1+")");
    selectArray.push(".chibiPoint_cell:nth-of-type("+columnIndexed1+")");
    grid.pushHistory(selectArray.join(" "));

    createGrid($(grid.getLatestSelector()).first());

    // move crosshairs              
    crosshairs.updatePosition(grid);
    
    highlightTarget();
    Flyout.show();
    
  }
  
  function backup(grid, crosshairs) {
    var numpadMappings = birchlabs.numpadMappings;
    var Flyout = birchlabs.Flyout;
    
    if (gridIsInUse()) {
    
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
              $(this).text(String.fromCharCode(numpadMappings[(7-(i*3-p)).toString()][0]).toUpperCase());

              var trans = document.createElement('div');
              trans.className = "chibiPoint_backing";
              $(this).append(trans);
            }
          });
      });

      grid.getLastGrid().removeClass("chibiPoint_gridBorderOff");
      grid.getLastCells().removeClass("chibiPoint_cellBorderOff");
      grid.getLastGrid().addClass("chibiPoint_gridBorderOn");
      
      // if it's not too small, give it borders
      var rect = $(grid.getLatestSelector()).get(0).getBoundingClientRect();
      if (rect.width>60 && rect.height >60) {
        grid.getLastCells().addClass("chibiPoint_cellBorderOn");
      }

      unpointFlyouts();

      var exists = grid.getLastGrid().length>0;
      if (exists) {
        // move crosshairs
        crosshairs.updatePosition(grid);
        Flyout.show();
        highlightTarget();
      } else {
        closeGrid();
      }
    }
  }
  
  function clickOrFocus(element) {
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
      evaluatorWriteState(element);
      element.click();
      element.focus();
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

      element.removeClass("chibiPoint_targeted");
      element.addClass("chibiPoint_cluck");
      
      var flash = setInterval(function() {
        if (element.hasClass("chibiPoint_cluck")) {
          element.removeClass("chibiPoint_cluck");
        } else {
           element.addClass("chibiPoint_cluck");
        }
      }, 100);
      
      var delayUnclick = setInterval(function () {
          clearInterval(flash);
          clearInterval(delayUnclick);
          element.removeClass("chibiPoint_cluck");
      clickOrFocus(element.get(0));
        pointFlyouts();
        }, 500);
      //element.get(0).click();
      
      
    }
  }
  
  function shortcut() {
    if (!birchlabs.evaluateTabMode) {
      toggleGrid();
      evaluatorIncrementKeys("Cmd_K");
    }
  }
  
  function toggleGrid() {
    if (!birchlabs.evaluateTabMode) {
      var Flyout = birchlabs.Flyout;

      var crosshairs = birchlabs.crosshairs;
      var container = birchlabs.container;
      var grid = birchlabs.grid;

      document.activeElement.blur();
      //document.documentElement.focus();

      if (gridIsEmpty()) {
        // need to make a grid
        grid.initialize();
        $(".chibiPoint_gridContainer").removeClass("chibiPoint_hiddenGridContainer");
        createGrid(container);

        //crosshairs = crosshairs||new birchlabs.Crosshairs(document.documentElement, grid);
        //birchlabs.crosshairs = crosshairs;

        // in case crosshairs already instantiated
        crosshairs.updatePosition(grid);
        Flyout.show();
        highlightTarget();
        crosshairs.show();
      } else {
        // toggle grid off
        closeGrid();
      }
    }
  }
  
  function closeGrid() {
    var Flyout = birchlabs.Flyout;
    
    var crosshairs = birchlabs.crosshairs;
    var grid = birchlabs.grid;
    
    grid.initialize();
    $(grid.getLatestSelector()).empty();

    $(".chibiPoint_gridContainer").addClass("chibiPoint_hiddenGridContainer");
    
    unpointFlyouts();
    Flyout.hide();
    crosshairs.hide();
  }
  
  function gridIsEmpty() {
    return $(".chibiPoint_gridContainer").children().length == 0;
  }
  
  function gridIsInUse() {
    //var grid = birchlabs.grid;
    return $(".chibiPoint_grid").children().length > 0;
  }
  
    return { init: init,
             createGrid: createGrid,
           shortcut: shortcut};
  });