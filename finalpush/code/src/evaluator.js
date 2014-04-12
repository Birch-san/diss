define(["lib/jquery-2.1.0.min", "lib/FileSaver", "trace"], function(jq, saver, tracer) {
  window.evaluator = window.evaluator||{};
  var evaluator = window.evaluator;
  
  window.birchlabs = window.birchlabs||{};
  var birchlabs = window.birchlabs;
  
  function makeEvaluators() {    
    var keyCountElem = makeKeyCount(document.documentElement);
    var timerElem = makeTimer(document.documentElement);
    
    var keys = "";
    var times = "";
    var timeDeltas = "";
    var timesHuman = "";
    var timeDeltasHuman = "";
    var keyCount = 0;
    var timer = new Date().getTime();
    var totalTime = 0;
    // this timer is running before any keypresses are used
    var trueBegin = new Date().getTime();
    var beginDelta = 0;
    var wholeDuration = 0;
    
    evaluator.keys = keys;
    evaluator.times = times;
    evaluator.timeDeltas = timeDeltas;
    evaluator.timesHuman = timesHuman;
    evaluator.timeDeltasHuman = timeDeltasHuman;
    evaluator.keyCount = keyCount;
    evaluator.timer = timer;
    evaluator.trueBegin = trueBegin;
    evaluator.beginDelta = beginDelta;
    evaluator.wholeDuration = wholeDuration;
    evaluator.totalTime = totalTime;
    
    evaluator.keyCountElem = keyCountElem;
    evaluator.timerElem = timerElem;
    
    birchlabs.downloadTelemetry = false;
    
    drawEvaluators();
  }
  
  function clickOrFocus(element) {
    var justFocus = {//"A":true,
                         "INPUT":true,
                         "TEXTAREA":true,
                         "SELECT":true,
                         "BUTTON":true//,
                         //"output":true,
                         //"command":true,
                         //"kbd":true
                         };
    
    if (justFocus[element.nodeName]) {
      element.focus();
      checkNewFocus(element, window.location);
    } else {
      evaluatorWriteState(element);
      element.click();
      element.focus();
    }
  }
  
  function checkFocusAfterWait() {
    focusCheckTimer = setInterval(function () {
        clearInterval(focusCheckTimer);
        checkNewFocus(document.activeElement, window.location);
      }, 0);
  }
  
  function checkNewFocus(element, location) {
    tracer.trace(element);
    tracer.trace(location.host);
    endTest = false;
    
    if (location.host == "www.halifax-online.co.uk") {
      if (element.id == "frmLogin:strCustomerLogin_pwd") {
        endTest = true;
      }
    } else if (location.host == "www.kickstarter.com") {
      if (element.id == "user_password_confirmation") {
        endTest = true;
      }
    }
    
    if (endTest) {
      evaluatorWriteState(element);
      alert("Success! Please move on to the next test.");
    }
  }
  
  function makeTimer(root) {
    var parent = document.createElement('div');
    parent.className = 'chibiPoint_timer';
    $(root).append(parent);
    return parent;
  }
  
  function makeKeyCount(root) {
    var parent = document.createElement('div');
    parent.className = 'chibiPoint_keyCount';
    $(root).append(parent);
    return parent;
  }  
  
  function evaluatorIncrementKeys(theKey) {
    
    var evaluator = window.evaluator;
    
    var nowTime = (new Date().getTime());
    if (evaluator.keyCount==0) {
      var beginDelta = nowTime-evaluator.trueBegin;
      evaluator.beginDelta = beginDelta;
      // time from the first keypress
      evaluator.timer = nowTime;
    }
    
    var thisDelta = nowTime-(evaluator.timer+evaluator.totalTime);
    var wholeDelta = nowTime-evaluator.timer;
    
    var nowDate = new Date(nowTime);
    var nowDateString = (nowDate.toLocaleDateString() + " " + nowDate.toLocaleTimeString());
    
    evaluator.keyCount++;
    evaluator.keys += theKey+",";
    evaluator.times += nowTime+",";
    evaluator.timeDeltas += thisDelta+",";
    evaluator.timesHuman += nowDateString+", ";
    evaluator.timeDeltasHuman += formatTime(thisDelta)+", ";
    evaluator.totalTime = wholeDelta;
    evaluator.wholeDuration = wholeDelta+evaluator.beginDelta;
    
    //evaluator.keyCountElem.innerHTML = keyCount;
    //evaluator.timerElem.innerHTML = timer;
    
    drawEvaluators();
  }
  
  function drawEvaluators() {
    var evaluator = window.evaluator;
    
    evaluator.keyCountElem.innerHTML = evaluator.keys;
    evaluator.timerElem.innerHTML = formatTime(evaluator.totalTime);
  }
  
  
  function formatTime(time) {
      var ret = time % 1000 + ' ms';
      time = Math.floor(time / 1000);
      if (time !== 0) {
          ret = time % 60 + "s "+ret;
          time = Math.floor(time / 60);
          if (time !== 0) {
              ret = time % 60 + "min "+ret;
              time = Math.floor(time / 60);
              if (time !== 0) {
                  ret = time % 60 + "h "+ret;
              }
          }           
      }
      return ret;
  }
  
  function evaluatorWriteState(clickedElem) {    
    //var b = blob.Blob;
    //console.log(b);
    
    var endMilli = parseInt(evaluator.timer)+parseInt(evaluator.totalTime);
    
    var startDate = new Date(evaluator.timer);
    var endDate = new Date(endMilli);
    var trueBeginDate = new Date(evaluator.trueBegin);
    
    var output = "page: "+document.URL;
    output += "\n clicked: "+clickedElem;
    output += "\n startTime: "+evaluator.timer;
    output += "\n endTime: "+endMilli;
    output += "\n duration: "+evaluator.totalTime;
    output += "\n durationHuman: "+formatTime(evaluator.totalTime);
    // includes think time before first keypress
    output += "\n\n trueBegin: "+evaluator.trueBegin;
    output += "\n trueBeginDate: "+(trueBeginDate.toLocaleDateString() + " " + trueBeginDate.toLocaleTimeString());
    output += "\n thinkDuration: "+evaluator.beginDelta;
    output += "\n thinkDurationHuman: "+formatTime(evaluator.beginDelta);
    output += "\n wholeDuration: "+evaluator.wholeDuration;
    output += "\n wholeDurationHuman: "+formatTime(evaluator.wholeDuration);
    output += "\n\n startDate: "+(startDate.toLocaleDateString() + " " + startDate.toLocaleTimeString());
    output += "\n endDate: "+(endDate.toLocaleDateString() + " " + endDate.toLocaleTimeString());
    output += "\n\n times: "+evaluator.times;
    output += "\n timesHuman: "+evaluator.timesHuman;
    output += "\n\n timeDeltas: "+evaluator.timeDeltas;
    output += "\n timeDeltasHuman: "+evaluator.timeDeltasHuman;
    output += "\n\n keyCount: "+evaluator.keyCount;
    output += "\n keys: "+evaluator.keys;
    
    output += "\n\n CHIBIPOINT ON: "+(!birchlabs.evaluateTabMode);
    output += "\n FLYOUTS ON: "+birchlabs.flyoutsOn;
    
    var finalElem = "\n\nClicked.. \n";
    for (var j in clickedElem) {
		finalElem += " "+ j + ": " + clickedElem[j] + "\n";
	}
    
    output += finalElem;
    
    var bb = new Blob([output]);
    //console.log(bb);
    //bb.append((new XMLSerializer).serializeToString(document));
    //var blob = bb.getBlob("application/xhtml+xml;charset=" + document.characterSet);
    if (birchlabs.downloadTelemetry) {
      saver.saveAs(bb, "document.txt");
    }
  }
 
 return {makeEvaluators:makeEvaluators,
         clickOrFocus:clickOrFocus,
        evaluatorIncrementKeys:evaluatorIncrementKeys,
        evaluatorWriteState:evaluatorWriteState,
        checkNewFocus:checkNewFocus,
        checkFocusAfterWait:checkFocusAfterWait};
});