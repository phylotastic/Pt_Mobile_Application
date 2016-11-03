var TIMEOUT_CONNECTION = 25000;

function standardTreeFromOpenTree(tree_text){
	var beautifulTreeText = tree_text.replace(/[0-9]/g,'');
	beautifulTreeText = beautifulTreeText.replace(/_ott/g,'');
	beautifulTreeText = beautifulTreeText.replace(/_/g,' ');
	/* Remove internal node in Newick Tree */
	beautifulTreeText = beautifulTreeText.replace(/\)[a-z|A-Z]+/g, ')');
	/* End removing */
	return beautifulTreeText;
};

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};


function getMaxID(JSON_LIST) {
	var maxID = 0;
	for(var index = 0 ; index < JSON_LIST.length ; index++){
		if (JSON_LIST[index].id > maxID){
			maxID = JSON_LIST[index].id;
		}
	}
	return maxID;
}

function update_object_of_master_list(species_list_object, species_names_list){
	species_list_object.species = species_names_list;
	species_list_object.quantity = species_names_list.length;
	//console.log(species_list_object);
}

function update_master_list(species_list_object, master_list){
	for(var index = 0 ; index < master_list.length ; index++){
		if (species_list_object.id === master_list[index].id){
			master_list[index] = species_list_object;
		}
	}
	//console.log(master_list[0]);
}

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

function check_exits_name_in_list(JSONArray,speciesName){
	if (isEmpty(speciesName)){
		return true;
	}
	speciesName = speciesName.toString().trim().toUpperCase();
	for(var index = 0 ; index < JSONArray.length ; index++){
		if (isEmpty(JSONArray[index])){
			continue;
		}
		
		var element = JSONArray[index].toString().trim().toUpperCase();
		//console.log("Check : " + speciesName + " :: " + element);
		if (speciesName == element){
			return true;
		}
	}
	return false;
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

function delete_SpeciesList_into_Master_List(species_list_object,JSONArray){
	for (var index = 0; index < JSONArray.length; index++) {
	    var deleted_species_names_list = JSONArray[index];
	    if(deleted_species_names_list.id === species_list_object.id){
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