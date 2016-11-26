var app = angular.module("weather-widget",[])
app.directive("weatherWidgetAd",function(){
	return{
		restrict :'E',
		scope :{
			city : '@',
			units :'@'
		},
		templateUrl : 'template/weatherview.html',
		 css: 'css/w3.css',
		controller : function($scope,weatherReport){
			    var city = $scope.city;
			    var units = $scope.units;
				weatherReport.getWeather(city,units).then(function(citydata){
					$scope.data = citydata;
					//console.log($scope.data);
					//$scope.$emit('statusUpdate');
			   });


		},

		link : function (scope,element,attributes) {
			scope.city = attributes.city;
			scope.units = attributes.units;
				//console.log("hi");
				
		},

		 
	};
});

app.service('weatherReport',['$http', '$q', '$sce',function( $http,$q,$sce) {

       this.getWeather = function(city, units){
		 //console.log("city : "+city);
		var vm ={city:"",currentTem:"",maxTemp:"",minTemp:""};
		var weatherIcons=[];
		   //var json = require('data.json');
           var deferred = $q.defer();
  		  var URL = 'http://api.openweathermap.org/data/2.5/weather';
  
		  var request = {
			method: 'GET',
			url: URL,
			params: {
			   q: city,
			  mode: 'json',
			  units: units,
			  cnt: '7',
			  appid: 'e5471cc3f2f4dd55c3dccf8531037468'
			}
		  };

		   var request2 = {
			method: 'GET',
			url: "js/wea.json",
			
		  };

		  $http(request2)
	       .success(function(res){
	          weatherIcons = res;                
         });
		
		$http(request)
    		.success(function(response) {
			  //console.log(response);
      			//vm.data = response;
			vm.city = response.name;
			vm.symbol = angular.equals(units, 'metric');
			vm.currentTemp = response.main.temp;
			vm.maxTemp = response.main.temp_max;
			vm.minTemp =  response.main.temp_min;
			vm.humidity =  response.humidity;
			vm.text = response.weather[0].description;
			vm.today = new Date();
			//vm.icon  = "http://openweathermap.org/img/w/"+response.weather[0].icon+".png";
			
			var prefix = 'wi wi-';
			var code  = response.weather[0].id;
			var icon = weatherIcons[code].icon;

			if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
			    icon = 'day-' + icon;
			}

  
  			vm.icon = prefix + icon;

     			//console.log(vm.data.list[0].temp.max);
			 	deferred.resolve(vm);
    		})
		   .error(function(err){
            // console.log('Error retrieving weather');
			//console.log(err);
            deferred.reject('Error retrieving weather');
          });
		  // console.log(deferred.promise);
		   return deferred.promise;
		 
		  return {
			   
        getWeather: vm
      };
	}
    
}]);

app.filter('symbol',function($sce){
    return function(input){
    	console.log($sce.trustAsHtml(input));
        return $sce.trustAsHtml(input);
    }
});