//// Cheekily change DOM prototype before page loads
// http://stackoverflow.com/questions/8915461/how-to-find-out-what-event-listener-types-attached-to-specific-html-element-in-c
// from spektom, thanks to kdzwinel

var injectedJS = "\
(function(original) { \
  Element.prototype.addEventListener = function(type, listener, useCapture) { \
    var attr = this.getAttribute('_handlerTypes'); \
    var types = attr ? attr.split(',') : []; \
    var found = false; \
    for (var i = 0; i < types.length; ++i) { \
      if (types[i] == type) { \
        found = true; \
        break; \
      } \
    } \
    if (!found) { \
      types.push(type); \
    } \
    this.setAttribute('_handlerTypes', types.join(',')); \
    return original.apply(this, arguments); \
  } \
})(Element.prototype.addEventListener); \
\
(function(original) { \
  Element.prototype.removeEventListener = function(type, listener, useCapture) { \
    var attr = this.getAttribute('_handlerTypes'); \
    var types = attr ? attr.split(',') : []; \
    var removed = false; \
    for (var i = 0; i < types.length; ++i) { \
      if (types[i] == type) { \
        types.splice(i, 1); \
        removed = true; \
        break; \
      } \
    } \
    if (removed) { \
      this.setAttribute('_handlerTypes', types.join(',')); \
    } \
    return original.apply(this, arguments); \
  } \
})(Element.prototype.removeEventListener); \
";

var script = document.createElement("script");
script.type = "text/javascript";
script.appendChild(document.createTextNode(injectedJS));
document.documentElement.appendChild(script);

//////

url = "/src/";
if (chrome.extension != undefined) {
  url = chrome.extension.getURL("/src/");
}

require({ baseUrl:url  }, ["lib/jquery-2.1.0.min", "lib/within", "lib/Blob", "lib/FileSaver", "flyoutworker", "test", "trace", "lookup", "testonly", "setup", "Grid", "Crosshairs", "Flyout"], function ($, within, blob, saver, flyoutworker, test, trace, lookup, testonly, setup, gridclass, crosshairclass, flyout) {
  // default namespace
  window.birchlabs = {};
 
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
    
    if (typeof(chrome) == "object" && chrome.extension) {
    //chrome.extension.sendRequest({'get_options': true}, function(response) {
        setup.main();
      //});
    } else {  
      setup.main();
    }
});