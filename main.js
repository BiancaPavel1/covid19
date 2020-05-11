var geocoder;
var map;
function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(44.4267674, 26.1025384);
  var mapOptions = {
    zoom: 8,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {			
			getCovidData(results[0].address_components);
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function getCountryData(addressComponents) {
	var countryData = {};	
	for (var i = 0; i < addressComponents.length; i++) {
			if (addressComponents[i].types[0] == "country") {
				countryData['long_name'] = addressComponents[i].long_name;
				countryData['short_name'] = addressComponents[i].short_name;
				return countryData;
			}		
	}	
}

function getCovidData(addressComponents) {
	var countryData = getCountryData(addressComponents);
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://covid-19-data.p.rapidapi.com/country/code?format=json&code=" + countryData['short_name'],
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
      "x-rapidapi-key": "a152b21dacmsh7ca758470d5a2c5p135bd6jsn2c5106522991"
    }
  }
 
  $.ajax(settings).done(function (response) {   
    updateData(response[0]);
  });
};

function updateData(covidData) {
  console.log(covidData);
  $('#country').text(covidData.country);  
  $('#confirmed').text(covidData.confirmed);
  $('#recovered').text(covidData.recovered);
  $('#critical').text(covidData.critical);
  $('#deaths').text(covidData.deaths);
}


