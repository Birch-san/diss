define(["lib/jquery-2.1.0.min", "trace", "lookup", "testonly", "Grid", "Crosshairs"], function (jq, tracer, lookup, testonly, gridclass, crosshairclass) {
  var trace = tracer.trace;
  
  window.birchlabs = window.birchlabs||{};
  var birchlabs = window.birchlabs;
  
  //console.log(birchlabs);
  
  var grid = new birchlabs.Grid();
  birchlabs.theGrid = grid;
  
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
        }
        
        var $window   = $(window),
            resize_ok = true,
            timer;

        timer = setInterval(function () {
            resize_ok = true;
        }, 250);
        
        liveTargeter = function() {
          if (resize_ok === true) {
                resize_ok = false;
                //trace($window.width());
              //trace($(".verticalHair").first().offset().left);
              highlightTarget();
            }
        };

        $window.resize(liveTargeter);
        $window.scroll(liveTargeter);
        
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
    for (var i = 0; i < rootNodes.length; i++) {    
      var doc2 = rootNodes[i].document || rootNodes[i].contentDocument;
      if (!doc2 || !doc2.body)
        continue;


      var element = $(doc2.elementFromPoint(centerX, centerY));

      //console.log(element.get(0));
      
      //trace(birchlabs.targetedElement);

      // unhighlight previous element
      if (birchlabs.targetedElement != null) {
        birchlabs.targetedElement.removeClass("targeted");
        birchlabs.targetedElement.removeClass("cluck");
      }
      birchlabs.targetedElement = element;
      
      element.addClass("targeted");
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
      
    console.log(anticipatedHeight);
      
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

    console.log("not zero");
  }
  
  function backup(grid, crosshairs) {
    console.log("zero");
    // remove a grid!
    $(grid.getLatestSelector()).empty();
    grid.getPreviousSelector();

    trace(grid.getLatestSelector());

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

      console.log(element);

      element.removeClass("targeted");
      element.addClass("cluck");
      element.get(0).click();
    }
  }
  
    return { init: init,
             createGrid: createGrid};
  });