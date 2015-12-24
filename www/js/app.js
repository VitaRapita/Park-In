var App = App || {};

App.module = angular.module('parkingMap', ['ionic']);

App.module.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('parkingmenu', {
        url: "",
        abstract: true,
        templateUrl: "templates/menu.html"
      })
      .state('parkingmenu.home', {
        url: "/home",
        views: {
          'menuContent': {
            templateUrl: "templates/home.html"
          }
        }
      })
      .state('parkingmenu.list', {
        url: "/list-view",
        views: {
          'menuContent': {
            templateUrl: "templates/list.html",
            controller: "ListViewCtrl"
          }
        }
      })
      .state('parkingmenu.map', {
        url: "/map-view",
        views: {
          'menuContent': {
            templateUrl: "templates/map.html",
            controller: "MapViewCtrl",
          }
        }
      })
      .state('parkingmenu.about', {
        url: "/about",
        views: {
          'menuContent': {
            templateUrl: "templates/about.html",
            controller: "AboutViewCtrl"
          }
        }
      });

  $urlRouterProvider.otherwise("/home");
});

App.module.controller('MainCtrl', function ($scope, $ionicSideMenuDelegate) {
  //$scope.markers = App.markers;

  $scope.countPlacesText = App.defaults.countText;

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
});

App.module.controller('ListViewCtrl', function ($scope) {
  // Add some useful staff later
  $scope.markers = App.cars.concat(App.bicycles);
  /*var GMaps = google.maps;
  var map = new GMaps.Map(document.getElementById("map"));
  var userCoordinates = {
    lat: App.defaults.lat,
    lng: App.defaults.lng
  };
  var userPosition = new GMaps.LatLng(userCoordinates.lat, userCoordinates.lng);
  
  map.setCenter(userPosition);
  $scope.showMarker = function (data){
    //angular.forEach(markers, function(map) {
      //$scope.markers[i].setMap(map);
      //})
      if (item.title === data.title){
        return userPosition;
        consollog();
      };
  };*/

  });

App.module.controller('MapViewCtrl', function ($scope, $ionicLoading) {

    // Create an array of styles.
  var styles = [
    {
      stylers: [
        { hue: "#FFD39B" },
        { saturation: -30 }
    ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 20 },
        { visibility: "on" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  var GMaps = google.maps;
  var userCoordinates = {
    lat: App.defaults.lat,
    lng: App.defaults.lng
  };

  var userPosition = new GMaps.LatLng(userCoordinates.lat, userCoordinates.lng);

  var mapOptions = {
    center: userPosition,
    zoom: 12,
    mapTypeControlOptions: {
      mapTypeIds: [GMaps.MapTypeId.ROADMAP, 'map_style']
    }
    //mapTypeId: GMaps.MapTypeId.ROADMAP
  };

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new GMaps.StyledMapType(styles,
    {name: "Styled Map"});

  

  var map = new GMaps.Map(document.getElementById("map"), mapOptions);

  navigator.geolocation.getCurrentPosition(function (pos) {
    userCoordinates.lat = pos.coords.latitude;
    userCoordinates.lng = pos.coords.longitude;


    userPosition = new GMaps.LatLng(userCoordinates.lat, userCoordinates.lng);

    map.setCenter(userPosition);
    var userMarker = new GMaps.Marker({
      position: userPosition,
      map: map,
      title: "You are here",
      mark: true,
      icon: App.defaults.icons_car.info
    });
  });

  $scope.map = map;
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  //$scope.markers = [];
  //$scope.markers = App.cars.concat(App.bicycles);
  placeParkings();

  function getIcon (param, type) {
    if (type == 'car'){

    if (param < 15) {
      return App.defaults.icons_car.danger;
      //return $scope.type = 'car' ? App.defaults.icons_car.danger : App.defaults.icons_bicycle.danger; 
    }
    else if (param < 25) {
      return App.defaults.icons_car.warning;
      //return $scope.type = 'car' ? App.defaults.icons_car.warning : App.defaults.icons_bicycle.warning;
    }

    return App.defaults.icons_car.success;
    //return $scope.type = 'car' ? App.defaults.icons_car.success : App.defaults.icons_bicycle.success; 
  
  } else {

    if (param < 5) {
      return App.defaults.icons_bicycle.danger;
      //return $scope.type = 'car' ? App.defaults.icons_car.danger : App.defaults.icons_bicycle.danger; 
    }
    else if (param < 10) {
      return App.defaults.icons_bicycle.warning;
      //return $scope.type = 'car' ? App.defaults.icons_car.warning : App.defaults.icons_bicycle.warning;
    }

    return App.defaults.icons_bicycle.success;
  }
};

  $scope.GMarkers = [];

  function placeParkings() {

    var latlngBounds = new GMaps.LatLngBounds(),
        infoWindow = new GMaps.InfoWindow(),
        markers = $scope.markers,
        image, parkingPosition;

    angular.forEach(markers, function(data) {
      image = getIcon(data.countPlaces, data.type);

      parkingPosition = new GMaps.LatLng(data.lat, data.lng); // Створюємо об’єкт - точка на мапі

      if (data.mark) { // Якщо потрібно - встановлюємо маркер (позначку)
        var marker = new GMaps.Marker({
          position: parkingPosition,
          map: map,
          draggable: false,
          icon: image
        });
        $scope.GMarkers.push(marker);
        latlngBounds.extend(marker.position);
        (function (marker, data) {
          GMaps.event.addListener(marker, "click", function (e) {
            infoWindow.setContent('<strong>' + data.title + '</strong><br>' + $scope.countPlacesText + data.countPlaces);
            infoWindow.open(map, marker);
          });
        })(marker, data); // Передача актуальних параметрів в кожній ітерації
      }

      if (data.forpath) { // Якщо точка має брати участь в прокладені маршруту, зберігаємо її в масиві lat_lng
        lat_lng.push(new GMaps.LatLng(data.lat, data.lng));
      }
    });
  }

   // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < $scope.GMarkers.length; i++) {
      $scope.GMarkers[i].setMap(map);
    }
  };

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  };


  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new GMaps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide();
    }, function(error) {
      console.log('Unable to get location: ' + error.message);
    });
  };

  $scope.bicycleTap = function() {
    clearMarkers();
    $scope.markers = App.bicycles;
    placeParkings();
  };

  $scope.carTap = function() {
    clearMarkers(); 
    $scope.markers = App.cars;
    placeParkings();
    
  };

  // Create the search box and link it to the UI element.
  $scope.search = function() {
    var map = $scope.map;

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      angular.forEach(markers, function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      angular.forEach(places, function(place) {
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  };

});

App.module.controller('AboutViewCtrl', function($scope) {
  // Add some useful staff later
});

App.defaults = {
  lat: 49.839683,
  lng: 24.029717,
  countText: 'Кількість місць: ',
  icons_car: {
    info: 'images/user.png',
    success: 'images/successCar.png',
    warning: 'images/warningCar.png', 
    danger: 'images/dangerCar.png'
  },

  icons_bicycle: {
    success: 'images/successMarker.png',
    warning: 'images/warningMarker.png',
    danger: 'images/dangerMarker.png'
  }

};


App.markers = [  
  App.bicycles = [
  { 
    "type": 'bicycle',
    "title": 'Проспект Шевченка 20',
    "lat": '49.8364586',
    "lng": '24.0319841',
    "countPlaces": 8,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Площа Ринок 27',
    "lat": '49.841516',
    "lng": '24.030601',
    "countPlaces": 12,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Валова 15',
    "lat": '49.8400835',
    "lng": '24.0332446',
    "countPlaces": 6,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": ' Вул.Коперника 2',
    "lat": '49.8112045',
    "lng": '24.1403104',
    "countPlaces": 4,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул.Коперника 17',
    "lat": '49.8389998',
    "lng": '23.8825592',
    "countPlaces": 12,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул.Валова 2',
    "lat": '49.839294',
    "lng": '24.0308404',
    "countPlaces": 12,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Князя Романа',
    "lat": '49.83851872',
    "lng": '24.03262981',
    "countPlaces": 8,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Тершаківців 1',
    "lat": '49.834308',
    "lng": '24.0411034',
    "countPlaces": 8,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Площа Ринок 1',
    "lat": '49.8419029',
    "lng": '24.0315643',
    "countPlaces": 8,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Шпитальна 1',
    "lat": '49.8442348',
    "lng": '24.0240842',
    "countPlaces": 6,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Проспект Шевченка 24',
    "lat": '49.836179',
    "lng": '24.031486',
    "countPlaces": 6,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Братів Рогатинців 24',
    "lat": '49.8404441',
    "lng": '24.033977',
    "countPlaces": 6,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Площа Коліївщини 1',
    "lat": '49.8409',
    "lng": '24.034305',
    "countPlaces": 6,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул.Братів Рогатинців 43/12',
    "lat": '49.840032',
    "lng": '24.032421',
    "countPlaces": 2,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": ' Вул.Староєврейська 29',
    "lat": '49.8409631',
    "lng": '24.0337405',
    "countPlaces": 4,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Площа Митна 1',
    "lat": '49.839425',
    "lng": '24.037021',
    "countPlaces": 6,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Українська академія друкарства',
    "lat": '49.8697467',
    "lng": '24.0075946',
    "countPlaces": 12,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Лесі Українки 29',
    "lat": '49.8437411',
    "lng": '24.0315487',
    "countPlaces": 10,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Пл.Євгена Петрушевича 3',
    "lat": '49.833199',
    "lng": '24.037699',
    "countPlaces": 14,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул.Саксаганського, 5',
    "lat": '49.8351836',
    "lng": '24.0329843',
    "countPlaces": 3,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Проспект Шевченка 7',
    "lat": '49.8381224',
    "lng": '24.031658',
    "countPlaces": 4,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Площа Ринок 12',
    "lat": '49.841153',
    "lng": '24.032688',
    "countPlaces": 1,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Проспект Чорновола 61',
    "lat": '49.857692',
    "lng": '24.0198539',
    "countPlaces": 10,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Лесі Українки 1',
    "lat": '49.8442425',
    "lng": '24.0275879',
    "countPlaces": 5,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Вірменська 35',
    "lat": '49.843153',
    "lng": '24.034165',
    "countPlaces": 12,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Костюшка 11',
    "lat": '49.8411386',
    "lng": '24.0226245',
    "countPlaces": 5,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Коперника 40',
    "lat": '49.8112325',
    "lng": '24.1414747',
    "countPlaces": 6,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Леся Курбаса 4',
    "lat": '49.8419015',
    "lng": '24.0258751',
    "countPlaces": 4,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Проспект Чорновола 12',
    "lat": '49.8468551',
    "lng": '24.0254459',
    "countPlaces": 4,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Проспект Свободи 28',
    "lat": '49.844003',
    "lng": '24.026193',
    "countPlaces": 8,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Проспект Шевченка 7',
    "lat": '49.8381224',
    "lng": '24.031658',
    "countPlaces": 6,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Степана Бандери 12',
    "lat": '49.8354929',
    "lng": '24.014442',
    "countPlaces": 14,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Степана Бандери 28А',
    "lat": '49.8352255',
    "lng": '24.008428',
    "countPlaces": 7,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Карпінського 8',
    "lat": '49.836257',
    "lng": '24.012869',
    "countPlaces": 7,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Словацького 1',
    "lat": '49.8372706',
    "lng": '24.0241424',
    "countPlaces": 2,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Русових 1',
    "lat": '49.8337169',
    "lng": '24.0075555',
    "countPlaces": 1,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Площа Ринок 1',
    "lat": '49.8419029',
    "lng": '24.0315643',
    "countPlaces": 6,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Театральна 8',
    "lat": '49.841333',
    "lng": '24.0298661',
    "countPlaces": 8,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Університетська 1',
    "lat": '49.840307',
    "lng": '24.022194',
    "countPlaces": 12,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. К. Левицького 67',
    "lat": '49.8324405',
    "lng": '24.0442319',
    "countPlaces": 5,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Площа Галицька 1',
    "lat": '49.839317',
    "lng": '24.0330269',
    "countPlaces": 9,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул.Театральна 18',
    "lat": '49.842523',
    "lng": '24.029114',
    "countPlaces": 12,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул.Театральна 22',
    "lat": '49.8442557',
    "lng": '24.0283404',
    "countPlaces": 12,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Вул. Галицька 1',
    "lat": '49.8410105',
    "lng": '24.031225',
    "countPlaces": 4,
    "mark": true
  },
{ 
    "type": 'bicycle',
    "title": 'Площа Ринок 1',
    "lat": '49.841848',
    "lng": '24.032063',
    "countPlaces": 7,
    "mark": true
  }
],
      App.cars = [ 
      { 
    "type": 'car',
    "title": 'вул. Валова',
    "lat": '49.84000639',
    "lng": '24.03360933',
    "countPlaces": 72,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'Пр. Шевченка',
    "lat": '49.8369225',
    "lng": '24.0317838',
    "countPlaces": 46,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'Пр. Шевченка',
    "lat": '49.83679448',
    "lng": '24.03156922',
    "countPlaces": 46,
    "mark": true
  },
  { 
    "type": 'car',
    "title": 'вул. Театральна',
    "lat": '49.84280933',
    "lng": '24.02875727',
    "countPlaces": 21,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Вірменська',
    "lat": '49.84286468',
    "lng": '24.02820474',
    "countPlaces": 21,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Низький Замок',
    "lat": '49.84330057',
    "lng": '24.02792579',
    "countPlaces": 22,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Лесі Українки',
    "lat": '49.84383331',
    "lng": '24.02827984',
    "countPlaces": 21,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Січових Стрільців',
    "lat": '49.84059962',
    "lng": '24.02464312',
    "countPlaces": 40,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Костюшка',
    "lat": '49.84049929',
    "lng": '24.02326983',
    "countPlaces": 30,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Гнатюка',
    "lat": '49.84181638',
    "lng": '24.02388078',
    "countPlaces": 30,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Словацького',
    "lat": '49.83786622',
    "lng": '24.02388787',
    "countPlaces": 30,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Коперніка',
    "lat": '49.83595843',
    "lng": '24.0223977',
    "countPlaces": 20,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Саксаганського',
    "lat": '49.83429072',
    "lng": '24.03339475',
    "countPlaces": 21,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Вагова',
    "lat": '49.8452319',
    "lng": '24.02473929',
    "countPlaces": 14,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Руданського',
    "lat": '49.838356',
    "lng": '24.0305378',
    "countPlaces": 15,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'вул. Уласа Самчука',
    "lat": '49.82627601',
    "lng": '24.03209779',
    "countPlaces": 14,
    "mark": true
  },
  {
    "type": 'car',
    "title": 'Площа Івана Підкови',
    "lat": '49.8413335',
    "lng": '24.0288112',
    "countPlaces": 23,
    "mark": true
  },  
        {   
            "type": 'car',
            "title": 'вул. Волоська',
            "lat": '49.840221',
            "lng": '24.017666',
            "countPlaces": 48,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Липова Алея',
            "lat": '49.82022929',
            "lng": '24.05511133',
            "countPlaces": 41,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Матейка',
            "lat": '49.83738561',
            "lng": '24.01711092',
            "countPlaces": 16,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Шпитальна',
            "lat": '49.84441814',
            "lng": '24.02419685',
            "countPlaces": 25,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Винниченка',
            "lat": '49.84190334',
            "lng": '24.0370895',
            "countPlaces": 27,
            "mark": true, 
        },
       {    
            "type": 'car',
            "title": 'вул. Нижанківського',
            "lat": '49.8370914',
            "lng": '24.0325173',
            "countPlaces": 24,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'Пл. Двірцева (ЗД Вокзал)',
            "lat": '49.839466',
            "lng": '23.9946548',
            "countPlaces": 74,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Широка',
            "lat": '49.8422347',
            "lng": '23.9739942',
            "countPlaces": 37,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Любінська (Аеропорт)',
            "lat": '49.8192995',
            "lng": '23.9634335',
            "countPlaces": 40,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Пілотів',
            "lat": '49.8427392',
            "lng": '23.9722177',
            "countPlaces": 28,
            "mark": true, 
        },
       {    
            "type": 'car',
            "title": 'вул. Суботівська',
            "lat": '49.843253',
            "lng": '23.9675459',
            "countPlaces": 48,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Роксоляни',
            "lat": '49.845857',
            "lng": '23.9590839',
            "countPlaces": 45,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Виговського ',
            "lat": '49.81338838',
            "lng": '23.97618792',
            "countPlaces": 148,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'пл. Петрушевича',
            "lat": '49.833114',
            "lng": '24.036529',
            "countPlaces": 32,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. К. Левицького',
            "lat": '49.8334948',
            "lng": '24.041518',
            "countPlaces": 13,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Поліська',
            "lat": '49.8746293',
            "lng": '24.0632055',
            "countPlaces": 75,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Богданівська',
            "lat": '49.8567273',
            "lng": '24.0759352',
            "countPlaces": 256,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Пасічна',
            "lat": '49.8288515',
            "lng": '24.0718045',
            "countPlaces": 12,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Пекарська',
            "lat": '49.8367645',
            "lng": '24.0451471',
            "countPlaces": 20,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'Тракт Глинянський',
            "lat": '49.8414971',
            "lng": '24.0967535',
            "countPlaces": 65,
            "mark": true, 
        },
       {    
            "type": 'car',
            "title": 'вул. Кукурудзяна',
            "lat": '49.86480876',
            "lng": '24.05503071',
            "countPlaces": 114,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'Станція Личаків',
            "lat": '49.8378825',
            "lng": '24.0650895',
            "countPlaces": 22,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Трильовського',
            "lat": '49.78203211',
            "lng": '24.06496923',
            "countPlaces": 32,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'пр. Чевоної калини',
            "lat": '49.7833467',
            "lng": '24.0598939',
            "countPlaces": 118,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Зубрівська',
            "lat": '49.8007295',
            "lng": '24.0646375',
            "countPlaces": 24,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'пр. Червоної калини',
            "lat": '49.79835051',
            "lng": '24.0480279',
            "countPlaces": 25,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Хуторівка',
            "lat": '49.79913764',
            "lng": '24.03596695',
            "countPlaces": 252,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Г. Хоткевича',
            "lat": '49.79736133',
            "lng": '24.03870821',
            "countPlaces": 85,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Скрипника',
            "lat": '49.78946172',
            "lng": '24.05354561',
            "countPlaces": 240,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Драгана',
            "lat": '49.78367483',
            "lng": '24.05274153',
            "countPlaces": 20,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Зелена',
            "lat": '49.81783522',
            "lng": '24.05911814',
            "countPlaces": 41,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Стуса',
            "lat": '49.81391018',
            "lng": '24.04574633',
            "countPlaces": 70,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Г. Хоткевича',
            "lat": '49.79442488',
            "lng": '24.05023634',
            "countPlaces": 24,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Дж. Вашингтона',
            "lat": '49.8146994',
            "lng": '24.07083571',
            "countPlaces": 60,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Стуса',
            "lat": '49.8218895',
            "lng": '24.0387055',
            "countPlaces": 18,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Морозна(готель Соната)',
            "lat": '49.79629709',
            "lng": '24.06941476',
            "countPlaces": 48,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Хлібна',
            "lat": '49.8126255',
            "lng": '24.0698886',
            "countPlaces": 44,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Луганська',
            "lat": '49.80883188',
            "lng": '24.04317409',
            "countPlaces": 63,
            "mark": true, 
        },
       {
            "type": 'car',
            "title": 'вул. Вахнянина',
            "lat": '49.82973015',
            "lng": '24.05152649',
            "countPlaces": 52,
            "mark": true, 
        },
       {    
            "type": 'car',
            "title": 'вул. Антонича',
            "lat": '49.78223932',
            "lng": '24.06849595',
            "countPlaces": 52,
            "mark": true, 
        }
    ]
  ];
