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
setAlternativeActiveDocument(document);
//options = default_options;

if (typeof(chrome) == "object" && chrome.extension) {
  //chrome.extension.sendRequest({'get_options': true}, function(response) {
    main();
  //});
} else {  
  main();
}

function init() {
	draw();
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
  //if (search.mode) {
    //var color = colors[search.mode][(search.total < 1 && search.text) ? 'ko' : 'ok'] 
    box.style['background-color'] = "#ff0000";
  //}
  box.innerHTML = "<small>soup</small>";
  //box.style['top'] = ''
  //box.style['top'] = 100  + 'px';
}

function drawGrid(width, height) {
    var grid = '<div id="grid">',
        cell_html = '',
        i = 0, j = 0;

    for( ; i < width; i++) {
        cell_html += '<div class="cell"></div>';
    }

    for( ; j < height; j++) {
        grid += '<div class="row">' + cell_html + '</div>';
    }

    grid += '</div>';

    return grid;
}

function createGrid() {
    //var ratioW = Math.floor((window.innerWidth || document.documentElement.offsetWidth) / size),
     //   ratioH = Math.floor((window.innerHeight || document.documentElement.offsetHeight) / size);
	
	

    var parent = document.createElement('div');
    parent.className = 'grid';
    //parent.style.width = (ratioW * size) + 'px';
    //parent.style.height = (ratioH * size) + 'px';
	parent.style.width = '100%';
	parent.style.height = '100%';

    for (var i = 0; i < 3; i++) {
        for (var p = 0; p < 3; p++) {
            var cell = document.createElement('div');
            cell.style.height = '33%';
            cell.style.width = '33%';
			cell.innerHTML = 7-(i*3-p);
            parent.appendChild(cell);
        }
    }

    document.documentElement.appendChild(parent);
}

createGrid();

//$(drawGrid(2, 3)).appendTo();

