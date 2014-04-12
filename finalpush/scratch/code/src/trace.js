define([], function() {

everLogged = false;

function trace(message) {
  var logger = document.getElementById("logger");
    if (logger != null) {
      if (!everLogged) {
          logger.value = "";
          everLogged = true;
      }
      proposedValue = message +
      "\n" + logger.value;
      
      lines = proposedValue.split("\n", 100);
      
      culled = lines.join("\n");
      logger.value = culled;
  }
  console.log(message);
}

function supertrace(o) {
	for (var j in o) {
		trace(j + ": " + o[j]);
	}
}

function supertraceInline(o) {
	var traces = [];
	for (var j in o) {
		traces.push(j + ": " + o[j]);
	}
	// why array.join() isn't working haunts me
	var str = "";
	for (i=0; i<traces.length; i++) {
		if (i!=0) {
			str += ", \t";
		}
		str += traces[i];
	}
	trace(str);
}

  return {trace: trace,
         supertrace: supertrace,
         supertraceInline: supertraceInline};
});