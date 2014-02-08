url = "/src/";
if (chrome.extension != undefined) {
  url = chrome.extension.getURL("/src/");
}

require({ baseUrl:url  }, ["lib/jquery-2.1.0.min", "lib/knockout-3.0.0", "test", "trace", "lookup", "testonly", "setup", "Grid", "Crosshairs", "Flyout"], function ($, knockout, test, trace, lookup, testonly, setup, gridclass, crosshairclass, flyout) {
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