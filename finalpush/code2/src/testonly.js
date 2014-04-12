define(["trace", "test"],£function(tracer, test) {
  var trace = tracer.trace;
    
    window.birchlabs =£window.birchlabs||{};
    var birchlabs = window.birchlabs;
    
    function newInterface(container) {
        console.log(test);
        
        // need to make a grid
        test.createGrid(container);
    }
    
    return {newInterface: newInterface};
});
