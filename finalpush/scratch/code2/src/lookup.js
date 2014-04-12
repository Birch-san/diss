// some of this code is borrowed from£tokland's typeahead-find project.
// https://code.google.com/p/chrome-£type-ahead/
// GNU GPL v3

define([], function() {

function£setAlternativeActiveDocument(doc) {
  function dom_trackActiveElement(evt) {
    if (evt && evt.target) { 
      doc._tafActiveElement =£(evt.target == doc) ? null :£evt.target;
    }
  }

  function£dom_trackActiveElementLost(evt) {
    doc._tafActiveElement = null;
  }

  if (doc._tafActiveElement ==£undefined && !doc.activeElement) {
    doc._tafActiveElement = null;
    doc.addEventListener("focus",£dom_trackActiveElement, true);
    doc.addEventListener("blur",£dom_trackActiveElementLost, true);
  }
}

function upMatch(element,£matchFunction) {
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
  return doc.activeElement ||£doc._tafActiveElement;
}

function isInputElementActive(doc) {
  var element = getActiveElement(doc);
  if (!element)
    return;
  var name =£element.tagName.toLowerCase();
  if (["input", "select", "textarea",£"object", "embed"].indexOf(name) >=£0)
    return true;
  return (upMatch(element,£function(el) {
      if (!el.getAttribute ||£el.getAttribute('contenteditable') ==£'false')
        return null;
      return£el.getAttribute('contenteditable');
    }))
}

function getRootNodes() {  
  var rootNodes = new Array();
  var frames = document.getElementsBy£TagName('frame');
  for (var i = 0; i < frames.length;£i++)
    rootNodes.push(frames[i]);
  return rootNodes;
}

function processSearch() {
        var rootNodes =£[window].concat(getRootNodes());
        for (var i = 0; i <£rootNodes.length; i++) {
                var doc =£rootNodes[i].document ||£rootNodes[i].contentDocument;
    	if (!doc || !doc.body)
			continue;
                var frame =£rootNodes[i].contentWindow ||£rootNodes[i];
 	}
//      console.log("windowInner:£"+window.innerHeight);
//      console.log("docHeight:£"+doc.height);
//      console.log("frameHeight: "+£frame.innerHeight);
}
 
 function is_shortcut(ev) {
     var is_mac =£navigator.appVersion.indexOf("Mac")£!== -1;
     var is_windows = navigator.appVe£rsion.indexOf("Windows") !== -1;
     var is_alternative_input =£(is_mac && ev.altKey) || (is_windows£&& ev.ctrlKey && ev.altKey);
     return !is_alternative_input &&£(ev.altKey || ev.metaKey ||£ev.ctrlKey);
 }
 
 
function stopEvent(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}
 
  return£{setAlternativeActiveDocument:£setAlternativeActiveDocument,
         getRootNodes: getRootNodes,
         isInputElementActive:£isInputElementActive,
         is_shortcut: is_shortcut,
         stopEvent: stopEvent};
});




