require({ baseUrl: chrome.extension.getURL("/") }, ["jquery-2.1.0.min", "test", "trace", "lookup", "testonly", "setup"], function ($, test, trace, lookup, testonly, setup) {
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