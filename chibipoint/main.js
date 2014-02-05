// almost all of this code is borrowed from the typeahead-find project.

//alert("sup");

// Called when the user clicks on the browser action.
//chrome.browserAction.onClicked.addListener(function(tab) {
//chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // No tabs or host permissions needed!
  //console.log('Turning ' + tab.url + ' red!');
  //chrome.tabs.executeScript({
    //code: 'document.body.style.backgroundColor="red"'
  //});
//});

/* Styles and addStyle borrowed from nice-alert.js project */

var styles = '\
  #type-ahead-box {\
    position: fixed;\
    top: 0;\
    right: 0;\
    margin: 0;\
    text-align: left;\
    z-index: 2147483647;\
    color: #000;\
    border-bottom: 1px solid #ccc;\
    border-bottom: 1px solid rgba(0,0,0,0.3);\
    padding: 4px 8px;\
    opacity: 0.9;\
    float: right;\
    clear: both;\
    overflow: hidden;\
    font-size: 18px;\
    font-family: Arial, Verdana, Georgia, Serif;\
    white-space: pre-wrap;\
    min-width: 60px;\
    outline: 0;\
    -webkit-box-shadow: 0px 2px 8px rgba(0,0,0,0.2);\
    -moz-box-shadow: 0px 2px 8px rgba(0,0,0,0.3);\
  }\
  \
  #type-ahead-box small {\
    letter-spacing: -0.12em;\
    color: #444;\
  }'
  
  function addStyle(css) {
  var head = document.getElementsByTagName('head')[0];
  if (head) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }
}

function main() {
	
  // Use setInterval to add events to document.body as soon as possible
  interval_id = setInterval(function() {
    if (document.body) {
      clearInterval(interval_id);
      init();
    }
  }, 100);
}

function setAlternativeActiveDocument(doc) {
  function dom_trackActiveElement(evt) {
    if (evt && evt.target) { 
      doc._tafActiveElement = (evt.target == doc) ? null : evt.target;
    }
  }

  function dom_trackActiveElementLost(evt) { 
    doc._tafActiveElement = null;
  }

  if (doc._tafActiveElement == undefined && !doc.activeElement) {
    doc._tafActiveElement = null;
    doc.addEventListener("focus", dom_trackActiveElement, true);
    doc.addEventListener("blur", dom_trackActiveElementLost, true);
  }
}


// doesn't seem to be needed?
//setAlternativeActiveDocument(document);
//options = default_options;

if (typeof(chrome) == "object" && chrome.extension) {
  //chrome.extension.sendRequest({'get_options': true}, function(response) {
    main();
  //});
} else {  
  main();
}

function is_shortcut(ev) {
    var is_mac = navigator.appVersion.indexOf("Mac") !== -1;
    var is_windows = navigator.appVersion.indexOf("Windows") !== -1;
    var is_alternative_input = (is_mac && ev.altKey) || (is_windows && ev.ctrlKey && ev.altKey);
    return !is_alternative_input && (ev.altKey || ev.metaKey || ev.ctrlKey);
}

function stopEvent(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

function upMatch(element, matchFunction) {
  while (element) {
    var res = matchFunction(element);
    if (res == null)
      return null;
    else if (res)
      return element;
    element = element.parentNode;
  }
  return element;
}


function getActiveElement(doc) {
  return doc.activeElement || doc._tafActiveElement;
}

function isInputElementActive(doc) {
  var element = getActiveElement(doc);
  if (!element)
    return;
  var name = element.tagName.toLowerCase();
  if (["input", "select", "textarea", "object", "embed"].indexOf(name) >= 0)
    return true;
  return (upMatch(element, function(el) {
      if (!el.getAttribute || el.getAttribute('contenteditable') == 'false')
        return null;
      return el.getAttribute('contenteditable'); 
    }))
}

function getRootNodes() {  
  var rootNodes = new Array();
  var frames = document.getElementsByTagName('frame');
  for (var i = 0; i < frames.length; i++)
    rootNodes.push(frames[i]);
  return rootNodes;
}

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
  
  var selectHistory = [];
  selectHistory.push(".gridContainer");
  
  function getLatestSelector() {
    return selectHistory[selectHistory.length-1];
  }
  
  function getPreviousSelector() {
    if (selectHistory.length>1) {
      selectHistory.pop(selectHistory.length-1);
    }
    return getLatestSelector();
  }
  
  //createGrid();
	function setEvents(rootNode) {
		var doc = rootNode.contentDocument || rootNode;
		var body = rootNode.body;
		
		if (!body || !body.addEventListener) {
			return;
		}
		
		setAlternativeActiveDocument(document);
		
		// usually on keydown
		//processSearch();
		//draw();
      var container = makeGridContainer(document.documentElement);
      
            // need to make a grid
            selectHistory = [".gridContainer"];
            createGrid(container);
      
      doc.addEventListener('keypress', function(ev) {
      if (isInputElementActive(doc)) {
        return;
      }
      var code = ev.keyCode;
      var ascii = String.fromCharCode(code);
        
      if (!is_shortcut(ev) && ascii && [keycodes.enter].indexOf(code) == -1) {
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
            
            $(getLatestSelector()+" .cell").text("");
            
            var rowIndexed1 = 4-Math.ceil(num/3);
            var columnIndexed1 = ((num-1)%3)+1;
			//cell.innerHTML = 7-(i*3-p);
            
            selectArray = [];
            selectArray.push(getLatestSelector());
            selectArray.push(".grid");
            selectArray.push(".row:nth-of-type("+rowIndexed1+")");
            selectArray.push(".cell:nth-of-type("+columnIndexed1+")");
            selectHistory.push(selectArray.join(" "));
            
            createGrid($(getLatestSelector()).first());
            console.log("not zero");
          } else if (code == keycodes.zero) {
            console.log("zero");
            // remove a grid!
            $(getLatestSelector()).empty();
            getPreviousSelector();
            
            trace(getLatestSelector());
            
            var anticipatedHeight = $(getLatestSelector()).height();
            var cellHeight = anticipatedHeight/3;
            $(getLatestSelector()+" .grid .row").each(function(index) {
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
          }
        }
        if (code == keycodes.dot) {
          // click
          var $this = $(getLatestSelector()+" .grid").first();
          var offset = $this.offset();
          //console.log($this.get(0));
          //console.log($this.offset());
          var width = $this.outerWidth();
          var height = $this.outerHeight();
          
          var centerX = offset.left + width / 2;
          var centerY = offset.top + height / 2;
          
          console.log("x: "+centerX+" y: "+centerY);
          
          var rootNodes = [window].concat(getRootNodes());
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
            selectHistory = [".gridContainer"];
            createGrid(container);
          } else {
            // toggle grid off
            selectHistory = [".gridContainer"];
            $(getLatestSelector()).empty();
          }
        }
        stopEvent(ev);
      }
    }, false);
	}
	
	// guess this defers setting events until root is loaded?
  	var rootNodes = [document].concat(getRootNodes());
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

function processSearch() {
	var rootNodes = [window].concat(getRootNodes());
	for (var i = 0; i < rootNodes.length; i++) {
		var doc = rootNodes[i].document || rootNodes[i].contentDocument;
    	if (!doc || !doc.body)
			continue;
		var frame = rootNodes[i].contentWindow || rootNodes[i];
 	}
//	console.log("windowInner: "+window.innerHeight);
//	console.log("docHeight: "+doc.height);
//	console.log("frameHeight: "+ frame.innerHeight);
}

function draw() {
  var box = document.getElementById('type-ahead-box');
  if (!box) { 
    box = document.createElement('TABOX');
    box.id = 'type-ahead-box';
    document.documentElement.appendChild(box);
    addStyle(styles);
  }
  box.style.display = 'block';
  box.style['background-color'] = "#ff0000";
  box.innerHTML = "<small>soup</small>";
}

function makeGridContainer(root) {
  var parent = document.createElement('div');
  parent.className = 'gridContainer';
  $(root).append(parent);
  return parent;
}

function createGrid(root) {
	/*var rootNodes = [window].concat(getRootNodes());
	for (var i = 0; i < rootNodes.length; i++) {
		var doc = rootNodes[i].document || rootNodes[i].contentDocument;
    	if (!doc || !doc.body)
			continue;
		var frame = rootNodes[i].contentWindow || rootNodes[i];
 	}
	console.log("windowInner: "+window.innerHeight);
	console.log("docHeight: "+doc.height);
	console.log("frameHeight: "+ frame.innerHeight);*/
  
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