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

define(["test"], function (test) {

 window.birchlabs = window.birchlabs||{};
 var birchlabs = window.birchlabs;
 
// to begin with, not in test mode
birchlabs.testmode = false;
 
 chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    /*console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");*/
    if (request.greeting == "hello") {
      //sendResponse({farewell: "goodbye"});
     test.shortcut();
    }
  });

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
      test.init();
    }
  }, 100);
}




// doesn't seem to be needed?
//setAlternativeActiveDocument(document);
//options = default_options;



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
 
 return { main: main,
          is_shortcut: is_shortcut};
});