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
.controller('Species_Names_List_View_Ctrl', function($scope, $state, $ionicLoading,$ionicPopup) {
	console.log("View Species Names List");
	/* Global variable */
	var cur_species_names_list = JSON.parse(window.localStorage.getItem("current_species_names_list"));
	var cur_species_list_object = JSON.parse(window.localStorage.getItem("currect_species_list_object"));
	var email = window.localStorage.getItem('current_email_phylotastic');
	/* List data in list */
	$scope.species_names_list = cur_species_names_list;
	$scope.species_list_name = cur_species_list_object.species_list_name;
	
	/* Action in Page */
	$scope.gotoCamera = function() {
    	$state.go("phylotastic.image_view");
    };
    $scope.gotoHome = function() {
    	window.localStorage.setItem("PREVIOUS_PAGE_PHYLOTASTIC","SPECIES_NAMES_LIST_VIEW");
    	$state.go("phylotastic.home_page");
    };
    $scope.gotoHowToPage = function() {
    	$state.go("phylotastic.how_to_page");
    };
    $scope.build_view_tree = function() {
    	if (!isEmpty(cur_species_names_list) && cur_species_names_list.length > 0){
    		$state.go("phylotastic.tree_view");
    	} else {
    		var alertPopup = $ionicPopup.alert({
			     title: 'Phylotastic',
			     cssClass: 'custom-popup',
			     template: 'We are sorry.  We could not find phylogeny information for these species.'
			});
    		return;
    	}
    	
    };
    $scope.confirmDelete = function(item){
    	//document.getElementById(item).innerHTML = "<font color='red'><b>Delete</b></font>&nbsp;&nbsp;" + item;
    	document.getElementById(item).style.color = "red";
    	var confirmPopup = $ionicPopup.confirm({
		     title: 'Phylotastic',
		     cssClass: 'custom-popup',
		     template: 'Do you want to delete <b>' + item + '</b> out of current list ?'
		   });

		confirmPopup.then(function(res) {
		     if(res) {
		    	 /* Remove item out of list */
		    	 //document.getElementById(item).innerHTML = item;
		    	 document.getElementById(item).style.color = "black";
		    	 console.log(item);
		    	 var delete_result = delete_SpecieName_into_SpeciesNames_List(item,cur_species_names_list);
		    	 if (delete_result){
		    		 
		    		 //$scope.species_names_list = "";
		    		 /* Update to current object */
		    		 var main_object_species_list_list =  JSON.parse(window.localStorage.getItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC"));
					 var current_species_list_object = JSON.parse(window.localStorage.getItem("currect_species_list_object") );
					 update_object_of_master_list(current_species_list_object,cur_species_names_list);
					 window.localStorage.setItem("currect_species_list_object",JSON.stringify(current_species_list_object));
					 window.localStorage.setItem("current_species_names_list",JSON.stringify(cur_species_names_list));
					 update_master_list(current_species_list_object, main_object_species_list_list);
					 window.localStorage.setItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC",JSON.stringify(main_object_species_list_list));	
					 /* End Update */
					 $scope.species_names_list = cur_species_names_list;
		    	 }
		    	 
		     } else {
		    	//document.getElementById(item).innerHTML = item; 
		    	document.getElementById(item).style.color = "black";
		    	return;
		     }
		});
    };
})
/****************************************/
/** Tree_View_Ctrl Controller **/
/****************************************/
.controller('Tree_View_Ctrl', function($scope, $state, $ionicLoading, $http,$ionicPopup,$timeout) {
	console.log("Tree View Controller");
	/* Global variable */
	var cur_species_names_list = JSON.parse(window.localStorage.getItem("current_species_names_list"));
	var produced_taxa_species_names = "";
	var boolean_getResultOpenTree = false;
	for(var i = 0 ; i < cur_species_names_list.length; i++){
		if (i == cur_species_names_list.length - 1){
			produced_taxa_species_names = produced_taxa_species_names + cur_species_names_list[i];
		} else {
			produced_taxa_species_names = produced_taxa_species_names + cur_species_names_list[i] + "|";
		}
		
	}
	var global_tree_data = "";
	var myPopup;
	/* Activity */
	$scope.gotoCamera = function() {
    	$state.go("phylotastic.image_view");
    };
    $scope.gotoHome = function() {
    	window.localStorage.setItem("PREVIOUS_PAGE_PHYLOTASTIC","TREE_VIEW");
    	$state.go("phylotastic.home_page");
    };
    $scope.gotoHowToPage = function() {
    	$state.go("phylotastic.how_to_page");
    };
    $scope.export_tree = function() {
    	if (!isEmpty(global_tree_data)){
    		myPopup = $ionicPopup.show({
	    	    template: 
	    	              '<div align="center"><button class="button button-positive" style="width:200px" ng-click="openWebBrowserWithTree()">Open in Browser</button></div><br>' +
	    	              '<!-- <div align="center"><button class="button button-positive" style="width:200px" ng-click="emailToMeWithTree()">Email to Me</button></div><br> -->' +
	    	              '<div align="center"><button class="button button-positive" style="width:200px" ng-click="cancelExportTree()">No, thanks</button></div><br>',
	    	    title: 'Please select the method you want to export tree data.',
	    	    cssClass: 'custom-popup',
	    	    scope: $scope,
	    	});
    	} else {
    		var alertPopup = $ionicPopup.alert({
			     title: 'Oops !',
			     cssClass: 'custom-popup',
			     template: 'We are sorry.  We could not find phylogeny information for these species.'
			});
    	}	
    };
    
    $scope.openWebBrowserWithTree = function(){
    	console.log("Open in Web Browser");
    	//console.log(global_tree_data);
    	window.open('http://128.123.177.13/Phylotastic_DisplayTree_Project/display_tree.html?uri=&tree_data=' + global_tree_data + '&format=newick_text', '_system', 'location=no');
    	myPopup.close();
    	return true;
    };
    
    $scope.emailToMeWithTree = function(){
    	
    	var alertPopup = $ionicPopup.alert({
		     title: 'Oops !',
		     cssClass: 'custom-popup',
		     template: 'Sorry!  This feature is not implemented yet.'
		});
    	
    	myPopup.close();
    	return false;
    };
    
    $scope.cancelExportTree = function() {
    	myPopup.close();
    	return false;
    }
	
    if (checkNetConnection() === true ){			
    	    /* Using Web Service to get tree data */
			$ionicLoading.show({
		        template: '<ion-spinner icon="ios"></ion-spinner>Open Tree services are working...'
		     });
			var startTime = new Date().getTime();
			console.log(produced_taxa_species_names);
			$http({	
			    method: 'POST',
			    url: "http://phylo.cs.nmsu.edu:5004/phylotastic_ws/gt/ot/get_tree",
			    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			    timeout : TIMEOUT_CONNECTION,
			    transformRequest: function(obj) {
			        var str = [];
			        for(var p in obj)
			        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			        return str.join("&");
			    },
			    data: {taxa: produced_taxa_species_names}
		    }).success(
				function(data, status, headers, config) {
					console.log("Da lay duoc Tree DATA");
					$ionicLoading.hide();
					boolean_getResultOpenTree = true;
					var tree_data = data;
					global_tree_data = standardTreeFromOpenTree(tree_data.newick);
					//console.log("Phylotastic - tree data : " + JSON.stringify(tree_data));
					if (!isEmpty(tree_data)){
						if (!isEmpty(tree_data.newick)){
							    console.log(global_tree_data);
				                var dataObject = {
				                                newick: global_tree_data                 
				                };
				                
				                document.getElementById("svgCanvas").innerHTML = "";
				                
				                phylocanvas = new Smits.PhyloCanvas(
				                    dataObject,
				                    'svgCanvas', 
				                    1000, 1000
				                );
				                
						} else {
							var alertPopup = $ionicPopup.alert({
							     title: 'Oops !',
							     cssClass: 'custom-popup',
							     template: 'We are sorry.  We could not find phylogeny information for these species.'
							});
							return;
						}
					} else {
						var alertPopup = $ionicPopup.alert({
						     title: 'Oops !',
						     cssClass: 'custom-popup',
						     template: 'We are sorry.  We could not find phylogeny information for these species.'
						});
						return;
					}
					
			}).error(function(err) {
				//console.log("error la gi nhi ????");
				$ionicLoading.hide();
				var respTime = new Date().getTime() - startTime;
		        if(respTime >= TIMEOUT_CONNECTION){
		        	var alertPopup = $ionicPopup.alert({
					     title: 'Phylotastic',
					     cssClass: 'custom-popup',
					     template: 'Sorry!  We did not get a response in 25 seconds.  Please wait and try again later.'
					});
		        	
		        	alertPopup.then(function(res) {
		        		alertPopup.close();
						return; 
					 });
		        } else {
		        	var alertPopup = $ionicPopup.alert({
					     title: 'Phylotastic',
					     cssClass: 'custom-popup',
					     template: err.error
					});
		        	
		        	alertPopup.then(function(res) {
		        		alertPopup.close();
						return; 
					});
		        }
			   
		    });
    } else {
    	var alertPopup = $ionicPopup.alert({
		     title: 'Oops!',
		     cssClass: 'custom-popup',
		     template: 'Network error. Please check your connection and try again.'
		});
    	return;
    }
})	
/****************************************/
/** Login_Ctrl Controller **/
/****************************************/
.controller('Login_Ctrl', function($scope, $state, $http,$ionicHistory,$ionicLoading,$ionicPopup,$cordovaOauth) {
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
	
	/* Test Login with Google Account */
	$scope.googleSignIn_Device = function() {
        $cordovaOauth.google("936627843472-tbvfhfohauanrehv1l94a6lrj5lvq0r3.apps.googleusercontent.com", 
        		            ["https://www.googleapis.com/auth/urlshortener", 
        		             "https://www.googleapis.com/auth/userinfo.email"])
        .then(function(result) {
            var access_token = result.access_token;
            /* Request to get Email */
			$http({
			    method: 'GET',
			    url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + result.access_token,
			    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		    }).success(
				function(data, status, headers, config) {
					var email = data.email;
					var password = data.id;
					var localData = result.access_token;
			    	var objAuth = window.localStorage.getItem("AUTHENTICATION_LIST_LANDCOVER");
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
								console.log("Update");
								updateAuthExist(email,localData,listAuthentication['authentication']);
							}	
					}
					window.localStorage.setItem("current_json_auth_data_phylotastic", localData);
					window.localStorage.setItem("current_email_phylotastic",email);
					window.localStorage.setItem("current_password_phylotastic",password);

					window.localStorage.setItem("PHYLOTASTIC_AUTHENTICATION_LIST",JSON.stringify(listAuthentication));
					window.localStorage.setItem("PREVIOUS_PAGE_PHYLOTASTIC","LOGIN_PAGE");
					//$ionicLoading.hide();
					//console.log("GoogleAuthentication : " + JSON.stringify(listAuthentication));
					$state.go('phylotastic.home_page');	
			}).error(function(err) {
				var alertPopup = $ionicPopup.alert({
				     title: 'Oops!',
				     template: 'Your Google authentication is error. Please try again.'
				});
				return;
		    });
        }, function(error) {
        	var alertPopup = $ionicPopup.alert({
			     title: 'Oops!',
			     template: 'Your Google authentication is error. Please try again.'
			});
        	return;
        });
    };
    
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
					        var alertPopup = $ionicPopup.alert({
							     title: 'Oops!',
							     template: 'Username or password error. Please try again.'
							});
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
	var email = window.localStorage.getItem('current_email_phylotastic');
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
			 var alertPopup = $ionicPopup.alert({
			     title: 'Phylotastic',
			     cssClass: 'custom-popup',
			     template: 'Please select an image or take new photo'
			 });
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
						
						  if (resp.result.responses.length < 1) {
							   var alertPopup = $ionicPopup.alert({
								     title: 'Oops !',
								     cssClass: 'custom-popup',
								     template: 'No scientific name was found. Please try again. The Help page has tips on getting good photos.'
							   });
							   return;
						  } else {
							  if (Object.keys(resp.result.responses[0]).length === 0 && JSON.stringify(resp.result.responses[0]) === JSON.stringify({})){
								   var alertPopup = $ionicPopup.alert({
									     title: 'Oops !',
									     cssClass: 'custom-popup',
									     template: 'No scientific name was found. Please try again. The Help page has tips on getting good photos.'
								   });
								   return;
							  }
						  }
						  
						  contentOCR_Text_Result = resp.result.responses[0].textAnnotations[0].description;
						  
						  console.log("Phylotastic - OCR Result Data : " + contentOCR_Text_Result);
						  
						  if (isEmpty(contentOCR_Text_Result)){
							  //alert("There is no OCR data. Please re-do again");
							   var alertPopup = $ionicPopup.alert({
								     title: 'Oops !',
								     cssClass: 'custom-popup',
								     template: 'No scientific name was found. Please try again. The Help page has tips on getting good photos.'
							   });
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
													 /** Save to current species lists **/
													 var main_object_species_list_list =  JSON.parse(window.localStorage.getItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC"));
													 var current_species_list_object = JSON.parse(window.localStorage.getItem("currect_species_list_object") );
													 update_object_of_master_list(current_species_list_object,current_species_names_list);
													 window.localStorage.setItem("currect_species_list_object",JSON.stringify(current_species_list_object));
													 update_master_list(current_species_list_object, main_object_species_list_list);
													 window.localStorage.setItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC",JSON.stringify(main_object_species_list_list));													
													 /*  End */
													 var message = "";
													 if (scientific_names_list.length == 1){
														 message = "Names added : " + scientific_names_list[0];
													 } else {
														 message = "Names added : " + scientific_names_list[0] + " and " + (scientific_names_list.length  - 1) + " others";
													 }
													 
													 var confirmPopup = $ionicPopup.alert({
													     title: 'Success !',
													     cssClass: 'custom-popup',
													     template: message
													 });
		
													 /*
													 confirmPopup.then(function(res) {
													     if(res) {
													    	return;
													     } else {
													        $state.go("phylotastic.species_names_list_view");
													     }
													   });
													  */
													 confirmPopup.then(function(res) {
														confirmPopup.close();
														return; 
													 });
													 
												 } else {
													 
													 var alertPopup = $ionicPopup.alert({
													     title: 'Oops !',
													     cssClass: 'custom-popup',
													     template: 'No scientific name was found. Please try again. The Help page has tips on getting good photos.'
												     });
												     return;
												 }
											 } else {
												 //alert("Returned data from Web Service is in-valid structure or There is 0 scientific names can be found. Please check with Web Services admin");
												 var alertPopup = $ionicPopup.alert({
												     title: 'Oops !',
												     cssClass: 'custom-popup',
												     template: 'No scientific name was found. Please try again. The Help page has tips on getting good photos.'
											     });
												 return;
											 }
										} else {
											//alert("No return data from Phylotastic Web Service and GNRD. Please check with Web Services admin");
											var alertPopup = $ionicPopup.alert({
											     title: 'Phylotastic',
											     cssClass: 'custom-popup',
											     template: 'No scientific name was found. Please try again. The Help page has tips on getting good photos.'
										     });
											return;
										}
										
							  }).error(function(err) {
										$ionicLoading.hide();
										console.log(err.error);
										var alertPopup = $ionicPopup.alert({
										     title: 'Phylotastic',
										     cssClass: 'custom-popup',
										     template: 'No scientific name was found. Please try again. The Help page has tips on getting good photos.'
									    });
							  });  // End Request to GNRD
							  
						  }
					}, function(reason) {
						  console.log('Error: ' + reason.result.error.message);
						  $ionicLoading.hide();
						  //alert(reason.result.error.message);
						  var alertPopup = $ionicPopup.alert({
							     title: 'Oops!',
							     cssClass: 'custom-popup',
							     template: 'No text found in image.'
						    });
						  
					});
			 } else {
				 //alert("No internet connection. Please turn on your network");
				 var alertPopup = $ionicPopup.alert({
				     title: 'Oops !',
				     cssClass: 'custom-popup',
				     template: 'Network error. Please check your connection and try again.'
			     });
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
    	window.localStorage.setItem("PREVIOUS_PAGE_PHYLOTASTIC","IMAGE_VIEW");
    	$state.go("phylotastic.home_page");
    };
    
    $scope.gotoCamera = function() {
    	$state.go("phylotastic.image_view");
    };
    
    $scope.gotoHowToPage = function() {
    	$state.go("phylotastic.how_to_page");
    };
})
/****************************************/
/** Home_Page_Ctrl Controller **/
/****************************************/
.controller('How_To_Page_Ctrl', function($scope,$state) {
	console.log("How to page");
	$scope.gotoPage = function(item){
		if (item === "OCR"){
			window.open('https://en.wikipedia.org/wiki/Optical_character_recognition', '_system', 'location=no');
			return;
		} else if (item === "GNRD"){
			window.open('http://gnrd.globalnames.org/', '_system', 'location=no');
			return;
		} else if (item === "OPEN_TREE"){
			window.open('http://opentreeoflife.org/', '_system', 'location=no');
			return;
		} else if (item === "GITHUB_ISSUE"){
			window.open('https://github.com/phylotastic/Phylotastic_Mobile_Application/issues/new', '_system', 'location=no');
			return;
		} else if (item === "PHYLOTASTIC") {
			window.open('http://www.phylotastic.org', '_system', 'location=no');
			return;
		}
	};
})
/****************************************/
/** Home_Page_Ctrl Controller **/
/****************************************/
.controller('Home_Page_Ctrl', function($scope,$state, $http,$ionicLoading,$ionicPopup) {
	/** Fake Data **/
	var jsonPhylotasticData = 
			[
			      {
			    	  "id":1,
			    	  "species_list_name":"Phylotastic Example list",
			    	  "date" : "2016-03-10",
			    	  "quantity" : 0,
			    	  //"species" : ['Zonotrichia capensis','Tangara vassori','Tangara nigroviridis','Diglossa glauca','Diglossa brunneiventris','Catamenia analis','Coninostrum cinereum','Spinus magellanicus','Spinus crassirostris','Sitta carolinensis','Microcerculus marginatus','Thryomanes bewickii','Henicorhina leucophrys','Pheugopedius eisenmanni','heugopedius genibarbis','Cantorchilus superciliaris','Cyphorhinus thoracicus','Cyphorhinus arada','Cinnycerthia peruana','Cinnycerthia olivascens','Troglodytes solstitialis','Troglodytes aedon (N. Amer.)','Troglodytes aedon (low Andes)','Troglodytes aedon (high Andes)','Troglodytes hiemalis','Cistothorus palustris','Campylorhynchus fasciatus','Myadestes ralloides','I Turdus fuscater','Turdus ignobilis','Turdus leucops','Entomodestes leucotis','Catharus fuscater','Catharus dryas','Cinclus leucocephalus','Mino dumonti','Orochelidon murina','Pygochelidon cyanoleuca','Atticora tibialis','Corvus cornix']
			    	  "species" : []
			      }
			 ];
	
	/** Activity **/
    $scope.gotoHome = function() {
    	console.log("Di home");
    	$state.go("phylotastic.home_page");
    };
    
    $scope.gotoCamera = function() {
    	console.log("Tam khoa di Camera");
        //alert("Please seclect a list you want to store new species names !");
        $ionicPopup.alert({
		     title: 'Oops !',
		     template: 'Please seclect a list, before trying to capture names !',
		     cssClass: 'custom-popup'
	    });
    	return;
    };
    
    $scope.gotoHowToPage = function() {
    	$state.go("phylotastic.how_to_page");
    };
    
    $scope.addNewMasterList = function() {
    		  $scope.data = {};

    		  // An elaborate, custom popup
    		  var myPopup = $ionicPopup.show({
    		    template: '<input type="text" ng-model="data.new_species_list_object_name">',
    		    title: 'Enter new list name',
    		    cssClass: 'custom-popup',
    		    scope: $scope,
    		    buttons: [
    		      { text: 'Cancel' },
    		      {
    		        text: '<b>Save</b>',
    		        type: 'button-positive',
    		        onTap: function(e) {
    		          if (!$scope.data.new_species_list_object_name) {
    		            return;
    		          } else {
    		            /* Add new species list object */
    		        	//Register new object
    		        	var JSON_OBJECT_STRING =  JSON.parse(window.localStorage.getItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC"));
    		        	var maximum_id = getMaxID(JSON_OBJECT_STRING);
    		        	d = new Date();
    					var current_date = d.yyyymmdd();
    		        	var newObject =  {
    					    	  "id":maximum_id + 1,
    					    	  "species_list_name": $scope.data.new_species_list_object_name.trim(),
    					    	  "date" : current_date,
    					    	  "quantity" : 0,
    					    	  "species" : []
    					      };
    		        	JSON_OBJECT_STRING.push(newObject);
    		        	window.localStorage.setItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC", JSON.stringify(JSON_OBJECT_STRING));
    		        	$scope.species_lists = JSON_OBJECT_STRING;
    		        	
    		          }
    		        }
    		      }
    		    ]
    		  });
    }
    /***************/
    $scope.confirmDelete = function(species_list_object) {
    	//console.log(species_list_object);
    	document.getElementById(species_list_object.id).style.color = "red";
    	var confirmPopup = $ionicPopup.confirm({
		     title: 'Phylotastic',
		     cssClass: 'custom-popup',
		     template: 'Do you want to delete <b>' + species_list_object.species_list_name + '</b> out of current list ?'
		   });

		confirmPopup.then(function(res) {
		     if(res) {
		    	 /* Remove item out of list */
		    	 document.getElementById(species_list_object.id).style.color = "black";
		    	 var JSON_OBJECT_STRING =  JSON.parse(window.localStorage.getItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC"));
		    	 var delete_result = delete_SpeciesList_into_Master_List(species_list_object,JSON_OBJECT_STRING);
		    	 if (delete_result){
		    		 /* Update to current object */
					 window.localStorage.setItem(email + "_" + "LIST_SPECIES_LISTS_PHYLOTASTIC",JSON.stringify(JSON_OBJECT_STRING));	
					 /* End Update */
					 $scope.species_lists = JSON_OBJECT_STRING;
		    	 }
		     } else {
		    	//document.getElementById(item).innerHTML = item; 
		    	document.getElementById(species_list_object.id).style.color = "black";
		    	//return;
		     }
		});
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
	//$ionicLoading.show({
	//      template: 'Loading Species Lists data...'
	//});	
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
	//$ionicLoading.hide();
    
}); // End HomePageCtrl
