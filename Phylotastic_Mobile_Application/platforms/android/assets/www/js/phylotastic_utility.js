function checkNetConnection(){
	 var xhr = new XMLHttpRequest();
	 //var file = "http://api.landpotential.org";
	 var file = "http://128.123.177.21:8080";
	 var r = Math.round(Math.random() * 10000);
	 xhr.open('HEAD', file , false);
	 try {
	  xhr.send();
	  console.log(xhr.status);
	  if (xhr.status >= 200 && xhr.status < 304) {
	   return true;
	  } else {
	   return false;
	  }
	 } catch (e) {
	  return false;
	 }
};


function isUsingByDevice() {
	if (window.cordova) {
		return true;
	} else {
		return false;
	}
};

function getTypeWebBrowser() {
	var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isFirefox = typeof InstallTrigger !== 'undefined'; 
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    var isChrome = !!window.chrome && !isOpera;            
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    
    
    if (isFirefox == true && isChrome == false && isOpera == false && isSafari == false && isIE == false) {
    	return "FIREFOX";
    } else if (isFirefox == false && isChrome == true && isOpera == false && isSafari == false && isIE == false) {
    	return "CHROME";
    } else if (isFirefox == false && isChrome == false && isOpera == true && isSafari == false && isIE == false) {
    	return "OPERA";
    } else if (isFirefox == false && isChrome == false && isOpera == false && isSafari == true && isIE == false) {
    	return "SAFARI";
    } else if (isFirefox == false && isChrome == false && isOpera == false && isSafari == true && isIE == false) {
    	return "IE";
    } else {
    	return "DEVICE";
    }  
};

function checkExist(value, JSONArray){
		var hasMatch =false;
		for (var index = 0; index < JSONArray.length; index++) {
		    var auth = JSONArray[index];
		    if(auth.email == value){
		      hasMatch = true;
		      break;
		    }
		}
		return hasMatch;
};


function insert_SpecieName_into_SpeciesNames_List(JSONArray,speciesName){
	speciesName = speciesName.toString().trim();
	if (!isEmpty(speciesName)){
		JSONArray.push(speciesName);
	}
};



function getListPlotInLocalCache(JSONArray){
	for (var index = 0; index < JSONArray.length; index++) {
	    var plot = JSONArray[index];
	    if (!isPlotInCloud(plot)){
	    	deleteLandInfoPlotInArrayt(plot.name,plot.recorder_name,JSONArray);
	    }
	}
	return JSONArray;
};

function delete_SpecieName_into_SpeciesNames_List(specieName,JSONArray){
	for (var index = 0; index < JSONArray.length; index++) {
	    var deleted_specieName = JSONArray[index];
	    deleted_specieName = deleted_specieName.toString().trim().toUpperCase();
	    specieName = specieName.toString().trim().toUpperCase();
	    if(deleted_specieName === specieName){
	       if (index > - 1){
	    	   JSONArray.splice(index, 1);
	    	   return true;
	       } else{
	    	   return false;
	       }
	    } 
	}
	return false;
};

function isEmpty(value){
	if (value == null || value == "undefined" || value == "" || value == 'null' || value == 'NULL') {
    	return true;
    } 
	return false;
};