angular.module('ionicApp', ['ionic','ionicApp.controller','ngCordova'])

.config(['$httpProvider', function($httpProvider) {
	 //$httpProvider.defaults.withCredentials = true;
	 $httpProvider.defaults.headers.common = {};
	 $httpProvider.defaults.headers.post = {};
	 $httpProvider.defaults.headers.put = {};
	 $httpProvider.defaults.headers.patch = {};
}])

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('phylotastic', {
      url: "/phylotastic",
      abstract : true,
      templateUrl: "templates/tabs.html"
    })
    .state('phylotastic.home_page', {
      url: "/home_page",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/home_page.html",
          controller: 'Home_Page_Ctrl'
        }
      }
    })
    .state('phylotastic.clear', {
      url: "/clear",
      views: {
        'home-tab': {
          templateUrl: "templates/clear.html",
          controller: 'ClearCtrl'
        }
      }
    })
    .state('phylotastic.how_to_page', {
      url: "/how_to_page",
      views: {
        'home-tab': {
          templateUrl: "templates/how_to_page.html",
          controller: 'How_To_Page_Ctrl'
        }
      }
    })
    .state('phylotastic.tree_view', {
      url: "/tree_view",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/tree_view.html",
          controller: 'Tree_View_Ctrl'
        }
      }
    })
    .state('phylotastic.login', {
      url: "/login",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/login.html",
          controller: 'Login_Ctrl'
        }
      }
    })
   .state('phylotastic.image_view', {
      url: "/image_view",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/image_view.html",
          controller: 'Image_View_Ctrl'
        }
      }
    })
  .state('phylotastic.species_names_list_view', {
      url: "/species_names_list_view",
      cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/species_names_list_view.html",
          controller: 'Species_Names_List_View_Ctrl'
        }
      }
    })
  .state('phylotastic.settings', {
      url: "/settings",
      views: {
        'settings-tab': {
          templateUrl: "templates/settings.html",
          controller: 'SettingsCtrl'  
        }
      }
    });
   
   /* Set up with authentication requirement */
   /*
   var listAuthentication = window.localStorage.getItem("PHYLOTASTIC_AUTHENTICATION_LIST");
   console.log("Test " + listAuthentication);
   if (listAuthentication === null || listAuthentication === 'null'){
	   $urlRouterProvider.otherwise("/phylotastic/login");
   } else {
	   var jsonObjAuth = JSON.parse(listAuthentication);
	   if (jsonObjAuth['authentication'].length == 1){	   
		   window.localStorage.setItem("current_json_auth_data_phylotastic", jsonObjAuth['authentication'][0].json_auth_data);
		   window.localStorage.setItem("current_email_phylotastic",jsonObjAuth['authentication'][0].email);
		   window.localStorage.setItem("current_password_phylotastic",jsonObjAuth['authentication'][0].password);
		   $urlRouterProvider.otherwise("/phylotastic/home_page");
	   } else {
		   $urlRouterProvider.otherwise("/phylotastic/accounts");
	   }
	   
   }
   */
   /* Set up without google authentication */
  var listAuthentication = window.localStorage.getItem("PHYLOTASTIC_AUTHENTICATION_LIST");
  console.log("Test " + listAuthentication);
  if (listAuthentication === null || listAuthentication === 'null'){
	   var listAuthentication = { authentication : []};
	   listAuthentication.authentication.push({
			"email" : "phylotastic_ios_mobile_app@gmail.com",
			"password" : "password",
			"json_auth_data" : "authentication_data"
	   });
	   
	   window.localStorage.setItem("current_json_auth_data_phylotastic", "authentication_data");
	   window.localStorage.setItem("current_email_phylotastic","phylotastic_ios_mobile_app@gmail.com");
	   window.localStorage.setItem("current_password_phylotastic","password");
	   
	   window.localStorage.setItem("PHYLOTASTIC_AUTHENTICATION_LIST",JSON.stringify(listAuthentication));
	   window.localStorage.setItem("PREVIOUS_PAGE_PHYLOTASTIC","LOGIN_PAGE");
	   $urlRouterProvider.otherwise("/phylotastic/home_page");
  } else {
	   var jsonObjAuth = JSON.parse(listAuthentication);
	   if (jsonObjAuth['authentication'].length == 1){	   
		   window.localStorage.setItem("current_json_auth_data_phylotastic", jsonObjAuth['authentication'][0].json_auth_data);
		   window.localStorage.setItem("current_email_phylotastic",jsonObjAuth['authentication'][0].email);
		   window.localStorage.setItem("current_password_phylotastic",jsonObjAuth['authentication'][0].password);
		   $urlRouterProvider.otherwise("/phylotastic/home_page");
	   } else {
		   $urlRouterProvider.otherwise("/phylotastic/accounts");
	   }
	   
  }
   
});







