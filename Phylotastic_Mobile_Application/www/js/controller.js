angular.module('ionicApp.controller',['ngCordova'])
/****************************************/
/*
 * Manage Controller
 */
/****************************************/
.factory('Camera', ['$q', function($q) {
	  return {
	    getPicture: function(options) {
	      var q = $q.defer();

	      navigator.camera.getPicture(function(result) {
	        // Do any magic you need
	        q.resolve(result);
	      }, function(err) {
	        q.reject(err);
	      }, options);

	      return q.promise;
	    }
	  }
	}])

/****************************************/
/** Species_Names_List_View_Ctrl Controller **/
/****************************************/
.controller('Species_Names_List_View_Ctrl', function($scope, $state, $ionicLoading) {
	console.log("View Species Names List");
	/* Global variable */
	var cur_species_names_list = JSON.parse(window.localStorage.getItem("current_species_names_list"));
	var cur_species_list_object = JSON.parse(window.localStorage.getItem("currect_species_list_object"));
	/* List data in list */
	$scope.species_names_list = cur_species_names_list;
	$scope.species_list_name = cur_species_list_object.species_list_name;
	
	/* Action in Page */
	$scope.gotoCamera = function() {
    	$state.go("phylotastic.image_view");
    };
    $scope.gotoHome = function() {
    	$state.go("phylotastic.home_page");
    };
    $scope.build_view_tree = function() {
    	if (!isEmpty(cur_species_names_list) && cur_species_names_list.length > 0){
    		$state.go("phylotastic.tree_view");
    	} else {
    		alert("Your tree is empty");
    		return;
    	}
    	
    };
})
/****************************************/
/** Tree_View_Ctrl Controller **/
/****************************************/
.controller('Tree_View_Ctrl', function($scope, $state, $ionicLoading, $http) {
	console.log("Tree View Controller");
	/* Global variable */
	var cur_species_names_list = JSON.parse(window.localStorage.getItem("current_species_names_list"));
	var produced_taxa_species_names = "";
	for(var i = 0 ; i < cur_species_names_list.length; i++){
		if (i == cur_species_names_list.length - 1){
			produced_taxa_species_names = produced_taxa_species_names + cur_species_names_list[i];
		} else {
			produced_taxa_species_names = produced_taxa_species_names + cur_species_names_list[i] + "|";
		}
		
	}
	
	/* Activity */
	$scope.gotoCamera = function() {
    	$state.go("phylotastic.image_view");
    };
    $scope.gotoHome = function() {
    	$state.go("phylotastic.home_page");
    };
	
    if (checkNetConnection() === true ){			
    	    /* Using Web Service to get tree data */
			$ionicLoading.show({
		        template: '<ion-spinner icon="ios"></ion-spinner>Open Tree services are working...'
		     });
			
			$http({
			    method: 'POST',
			    url: "http://phylo.cs.nmsu.edu:5004/phylotastic_ws/gt/ot/get_tree",
			    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			    
			    transformRequest: function(obj) {
			        var str = [];
			        for(var p in obj)
			        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			        return str.join("&");
			    },
			    data: {taxa: produced_taxa_species_names}
			   
		    }).success(
				function(data, status, headers, config) {
					$ionicLoading.hide();
					var tree_data = data;
					console.log("Phylotastic - tree data : " + JSON.stringify(tree_data));
					if (!isEmpty(tree_data)){
						if (!isEmpty(tree_data.newick)){
							    //console.log(tree_data.newick);
							   
				                var dataObject = {
				                                newick: tree_data.newick                  
				                };
				                phylocanvas = new Smits.PhyloCanvas(
				                    dataObject,
				                    'svgCanvas', 
				                    800, 800
				                );
						} else {
							alert("There is no data for tree");
							return;
						}
					} else {
						alert("There is no data for tree");
						return;
					}
					
			}).error(function(err) {
				$ionicLoading.hide();
			    alert(err.error,'Error');
		    });
    } else {
    	alert('No network connection. Please turn on your network');
    	return;
    }
})	
/****************************************/
/** Login_Ctrl Controller **/
/****************************************/
.controller('Login_Ctrl', function($scope, $state, $http,$ionicHistory,$ionicLoading) {
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
	}
	
	function updateAuthExist(email,auth_key,JSONArray){
		for (var index = 0; index < JSONArray.length; index++) {
		    var auth = JSONArray[index];
		    if(auth.email == email){
		        JSONArray[index].json_auth_data = auth_key;
		    }
		}
	}

	function clearAllCache() {
		console.log("Clear Cache");
		$ionicHistory.clearCache();
	}
	
    
	/* Test before click login */
	$scope.signIn = function(email, password) {
		        $ionicLoading.show({
		           template: '<ion-spinner icon="ios"></ion-spinner>Logging in...'
		        });
				var email = document.getElementById("email").value;
				var password = document.getElementById("password").value;				
				clearAllCache();
				$http({
					    method: 'POST',
					    url: "http://128.123.177.21:8080/auth/api_login",
					    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					    transformRequest: function(obj) {
					        var str = [];
					        for(var p in obj)
					        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					        return str.join("&");
					    },
					    data: {email: email, password: password}
				}).success(
						function(data, status, headers, config) {
							var localData = JSON.stringify(data);
							
							var objAuth = window.localStorage.getItem("PHYLOTASTIC_AUTHENTICATION_LIST");
							if (objAuth === null || objAuth === 'null'){
								var listAuthentication = { authentication : []};
								listAuthentication.authentication.push({
									"email" : email,
									"password" : password,
									"json_auth_data" : localData
								});
							} else {
								var listAuthentication = JSON.parse(objAuth);
								if (checkExist(email, listAuthentication['authentication']) == false){
									listAuthentication['authentication'].push({
										"email" : email,
										"password" : password,
										"json_auth_data" : localData
									});
								} else {
									updateAuthExist(email,localData,listAuthentication['authentication']);
								}	
							}
							window.localStorage.setItem("current_json_auth_data_phylotastic", localData);
							window.localStorage.setItem("current_email_phylotastic",email);
							window.localStorage.setItem("current_password_phylotastic",password);

							window.localStorage.setItem("PHYLOTASTIC_AUTHENTICATION_LIST",JSON.stringify(listAuthentication));
							window.localStorage.setItem("PREVIOUS_PAGE_PHYLOTASTIC","LOGIN_PAGE");
							$ionicLoading.hide();
							$state.go('phylotastic.home_page');
						
						}).error(function(err) {
							$ionicLoading.hide();
					        alert(err.error,'Authentication Error');
				        });  // End HTTP POST LOGIN
	}; // End SignIn
}) // End Controller SignInCtrl

/****************************************/
/** Clear Controller **/
/****************************************/
.controller('ClearCtrl', function($scope,$ionicHistory) {
  console.log("Clear Everything");
  window.localStorage.clear();
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
}) // End ClearCtrl

/****************************************/
/** Image_View_Ctrl Controller **/
/****************************************/
.controller('Image_View_Ctrl', function($scope,$state, $http,$ionicLoading,$cordovaCamera,$ionicPopup, $timeout) {
	var photo_data = JSON.parse(window.localStorage.getItem("current_photo_data_phylotastic"));
	if (!isEmpty(photo_data)){
	   $scope.pictureURL = photo_data;
	} else {
       $scope.pictureURL = 'img/800x800.png';
	}
	
	var finalImageData = "";
	var contentOCR_Text_Result = "";
	var scientific_names_list;
	
	
	$scope.submitOCR = function(){
		
		 if (isEmpty(finalImageData)){
			 alert("Please select an image or take new photo");
			 return;
		 } else {
			 if (checkNetConnection() === true ){
					 $ionicLoading.show({
				           template: '<ion-spinner icon="ios"></ion-spinner>Waiting for OCR Engine...'
				     });
					 var jsonRequest = {
							             "requests":[
							              {
							                "image":{
							                  "content":finalImageData, 
							                },
							                "features":[
							                  {
							                	"type": "TEXT_DETECTION",
							                    "maxResults":2
							                  }
							                ]
							              }
							            ]
							          }
					
					var API_KEY = "AIzaSyA-6xVFstqpFhFwOTYfJlHoRVgj9buA4oY"
					gapi.client.setApiKey(API_KEY);
					var restRequest = gapi.client.request({
						  'path': 'https://vision.googleapis.com/v1/images:annotate',
						  'method':'POST',
						  'params': {'key': API_KEY},
						  'headers':{'Content-Type':'application/json'},
						  'body': JSON.stringify(jsonRequest)
						  
					});
				    restRequest.then(function(resp) {
						  
						  $ionicLoading.hide();
						  console.log("DONE");
						  contentOCR_Text_Result = resp.result.responses[0].textAnnotations[0].description;
						  
						  console.log("Phylotastic - OCR Result Data : " + contentOCR_Text_Result);
						  
						  if (isEmpty(contentOCR_Text_Result)){
							  alert("There is no OCR data. Please re-do again");
							  return;
						  } else {
							  $ionicLoading.show({
						           template: '<ion-spinner icon="ios"></ion-spinner>GNRD is finding scientific names...'
						      });
							  /** Working with Phylotastic WS to get Scientific names **/
							  contentOCR_Text_Result = contentOCR_Text_Result.trim();
							  console.log("Phylotastic - Submit Text to GNRD");
							  $http({
								    method: 'POST',
								    url: "http://phylo.cs.nmsu.edu:5004/phylotastic_ws/fn/names_text",
								    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
								    transformRequest: function(obj) {
								        var str = [];
								        for(var p in obj)
								        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
								        return str.join("&");
								    },
								    data: {text: contentOCR_Text_Result}
							  }).success(
									function(data, status, headers, config) {
										$ionicLoading.hide();
										console.log("Phylotastic - GNRD results : " + JSON.stringify(data));
										if (!isEmpty(data)) {
											 if	(!isEmpty(data.scientificNames) && Object.prototype.toString.call(data.scientificNames) === '[object Array]'){
												 scientific_names_list = data.scientificNames; 
												 if (scientific_names_list.length > 0){
													 /* Can attach with currect_species_names_list */
													 var current_species_names_list = JSON.parse(window.localStorage.getItem("current_species_names_list"));
													 for(var index = 0 ; index < scientific_names_list.length ; index++){
														 insert_SpecieName_into_SpeciesNames_List(current_species_names_list,scientific_names_list[index]);
													 }
													 window.localStorage.setItem("current_species_names_list",JSON.stringify(current_species_names_list));
													 
													 var confirmPopup = $ionicPopup.confirm({
													     title: 'Phylotastic',
													     template: 'Your new species names are updated already in current list of species names. Do you want to continue capture photo ?'
													   });
		
													  confirmPopup.then(function(res) {
													     if(res) {
													    	//console.log("Current Species List : " + window.localStorage.getItem("current_species_names_list")); 
													    	return;
													     } else {
													    	//console.log("Current Species List : " + window.localStorage.getItem("current_species_names_list")); 
													        //console.log("Phylotastic - Move to Page - List of Species Names");
													        $state.go("phylotastic.species_names_list_view")
													     }
													   });
													 
													 
												 } else {
													 alert("There is 0 scientific names can be found");
												     return;
												 }
											 } else {
												 alert("Returned data from Web Service is in-valid structure or There is 0 scientific names can be found. Please check with Web Services admin");
											     return;
											 }
										} else {
											alert("No return data from Phylotastic Web Service and GNRD. Please check with Web Services admin");
											return;
										}
										
							  }).error(function(err) {
										$ionicLoading.hide();
								        alert(err.error,'');
							  });  // End Request to GNRD
							  
						  }
					}, function(reason) {
						  console.log('Error: ' + reason.result.error.message);
						  $ionicLoading.hide();
						  alert(reason.result.error.message);
						  
					});
			 } else {
				 alert("No internet connection. Please turn on your network");
				 return;
			 }
		 }
	};
	
	$scope.inPhotoLibrary = function(){
		 var options_library = {
				  quality: 100,
			      destinationType: Camera.DestinationType.DATA_URL,
			      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			      allowEdit: false,
			      encodingType: Camera.EncodingType.PNG,
			      targetWidth: 1080,
			      targetHeight: 720,
			      popoverOptions: CameraPopoverOptions,
			      saveToPhotoAlbum: false,
			      correctOrientation:true
		 };
		 $cordovaCamera.getPicture(options_library)
			.then(function(imageData){
				$scope.pictureURL = "data:image/jpeg;base64," + imageData;
				finalImageData = imageData;
			}, function(error) {
				console.log("Camera error : " + angular.toJson(error));
			});
		 
	};
	
    $scope.takePicture = function() {   
	   var options_camera = {
			      quality: 100,
			      destinationType: Camera.DestinationType.DATA_URL,
			      sourceType: Camera.PictureSourceType.CAMERA,
			      allowEdit: false,
			      encodingType: Camera.EncodingType.PNG,
			      targetWidth: 1080,
			      targetHeight: 720,
			      popoverOptions: CameraPopoverOptions,
			      saveToPhotoAlbum: false,
			      correctOrientation:true
	   };
	   
		$cordovaCamera.getPicture(options_camera)
		.then(function(imageData){
			$scope.pictureURL = "data:image/jpeg;base64," + imageData;
			finalImageData = imageData;
		}, function(error) {
			console.log("Camera error : " + angular.toJson(error));
		});
	};
	
	/** Activity **/
    $scope.gotoHome = function() {
    	$state.go("phylotastic.home_page");
    };
    
    $scope.gotoCamera = function() {
    	$state.go("phylotastic.image_view");
    };
})
/****************************************/
/** Home_Page_Ctrl Controller **/
/****************************************/
.controller('Home_Page_Ctrl', function($scope,$state, $http,$ionicLoading) {
	/** Fake Data **/
	var jsonPhylotasticData = 
			[
			      {
			    	  "species_list_name":"Today 03/04/2016",
			    	  "date" : "03-04-2016",
			    	  "quantity" : 0,
			    	  "species" : []
			      },
			      {
			    	  "species_list_name":"ThanhNh's List 1",
			    	  "date" : "03-03-2016",
			    	  "quantity" : 2,
			    	  "species" : ["Crabronidae", "Ophiocordyceps", "Megalyridae","Formica polyctena","Tetramorium caespitum","Pseudomyrmex","Carebara diversa","Formicinae"]
			      },
			      {
			    	  "species_list_name":"ThanhNh's List 2",
			    	  "date" : "03-03-2016",
			    	  "quantity" : 2,
			    	  "species" : ["Ochromonus", "Setophaga"]
			      }
			 ];
	
	/** Activity **/
    $scope.gotoHome = function() {
    	console.log("Di home");
    	$state.go("phylotastic.home_page");
    };
    
    $scope.gotoCamera = function() {
    	$state.go("phylotastic.image_view");
    };
    
    $scope.selectSpeciesList = function(species_list){
    	window.localStorage.setItem("current_species_names_list",JSON.stringify(species_list.species));
    	window.localStorage.setItem("currect_species_list_object",JSON.stringify(species_list));
    	$state.go("phylotastic.species_names_list_view");
    };
    
    /** Scenario **/
    var email = window.localStorage.getItem('current_email_phylotastic');
	var recorder_name = email;
	console.log("LIST of " + email);
	var previous_page = window.localStorage.getItem("PREVIOUS_PAGE_PHYLOTASTIC");
	var empty_species_names_list = [];
	window.localStorage.setItem("current_species_names_list",JSON.stringify(empty_species_names_list));
	/* Should be Processed Caching Data in HERE */
	$ionicLoading.show({
	      template: 'Loading Species Lists data...'
	});	
	if (previous_page === "LOGIN_PAGE") {
		   console.log(jsonPhylotasticData);
		   var JSON_OBJECT_STRING = jsonPhylotasticData;
		   console.log(JSON_OBJECT_STRING);
		   $scope.species_lists = JSON_OBJECT_STRING;
		   window.localStorage.setItem("PREVIOUS_PAGE_PHYLOTASTIC","LIST_SPECIES_LISTS_PAGE");
		   if($scope.species_lists.length > 0) {
			   var localPlots = JSON.stringify(JSON_OBJECT_STRING);	
			   window.localStorage.setItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC", localPlots);
		   }
    } else {
    	 $scope.species_lists = {};
	     var JSON_OBJECT_STRING =  JSON.parse(window.localStorage.getItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC"));
	     console.log(JSON_OBJECT_STRING);
	     $scope.species_lists = JSON_OBJECT_STRING;
    }
	$ionicLoading.hide();
    
}); // End HomePageCtrl
