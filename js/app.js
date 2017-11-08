//create list of places to show in the app.
let places = [
	{name: 'Suncorp Stadium', location: {lat:-27.464501, lng:153.009493}, key:'Suncorp Stadium'},
	//{name: 'Brisbane River', location: {lat:-27.475260, lng:153.023128}, key:'Brisbane River'},
	//{name: 'Cartier Brisbane', location: {lat:-27.469351, lng:153.027776}, key:'Cartier'},
	//{name: 'Story Bridge', location: {lat:-27.463937, lng:153.035754}, key:'story bridge'},
	//{name:'Queens Plaza', location:{lat:-27.468145, lng:153.026151}, key:'queens plaza'},
	//{name: 'Wheel of Brisbane', location: {lat:-27.475313, lng:153.020913}, key:'brisbane eye'}
];

let map, createMarkers, handleInfo;



//calback function for google map api.
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:-27.468657, lng:153.023913},
		zoom: 13
         });
	createMarkers();
}

//default error handling function for google map api.
function gm_authFailure() {
	alert('Sorry, cannot retrieve google map data');
}

//fall back error handling method for loading google map api.
function error() {
	alert('Sorry, error occurred when loading google map');
}

let Place = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
};

let ViewModel = function() {
	let self = this;

	this.hideWelcome = function() {
		$('.mask').css('display', 'none')
	}

	this.list = ko.observableArray([]);
	places.forEach(function(placeItem) {
		self.list.push(placeItem);
	});	

	this.keyWord = ko.observable('');
	
	//inspired by http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
	this.filteredList = ko.computed(function() {
		let word = self.keyWord().toLowerCase();
		if(!word) {
			return self.list();
		}else {
			return ko.utils.arrayFilter(self.list(), function(item) {
				return item.name.toLowerCase().includes(word);
			});
		}
	}); 

	this.filterMarker = function() {
		self.list().forEach(function(place) {
			place.marker.setMap(null);
		});
		self.filteredList().forEach(function(filteredPlace) {
			filteredPlace.marker.setMap(map);
		});
	};

	this.menuHandler = function() {
		$('#menu').toggleClass('hideList');
		$('#search,#list').toggleClass('hide');
		let map = document.getElementById('map');
		//shrink the map when the list shows.
		if (map.classList.contains('movemap')) {
			document.getElementById('map').classList.remove('movemap');
			document.getElementById('map').classList.add('loc');
		//expand the map when the list hides.
		}else {
			document.getElementById('map').classList.remove('loc');
			document.getElementById('map').classList.add('movemap');
		}
	};

	//for each place in the list, create a marker on the map.
	createMarkers = function() {
		self.filteredList().forEach(function(place) { 
			place.marker = new google.maps.Marker({
				position: place.location,
				map:map,
				title: place.name,
				animation: google.maps.Animation.DROP
			});


			//request information for each place from unsplash.
			$.ajax({
				url: 'https://api.unsplash.com/search/photos?page=1&query='+place.key,
				headers: {Authorization:'Client-ID c0581391ed463fc73e3ebaafc1e2ce6e03858c6629933b2e6d5e4920d2b12602'},
				dataType: "json",
				success: function(response) {

					place.info.setContent(place.key+'<br><br><img src='+ response.results[1].urls.small+ '></img>');
				},
			}).fail(function() {
					alert('Sorry your data cannot be loaded, please refresh page');
				});

			//create info window for each place
			place.info = new google.maps.InfoWindow({
				//content: info collected from wikiPedia will be append.
			});

			place.marker.addListener('click', function() {
				self.handleInfo(place);
	  		});
		});
	};


	//Handler for clicks on list item or markers.
	this.handleInfo = function(selection) {
		places.forEach(function(place) {
				place.info.close();
			});
		selection.info.open(map, selection.marker);
		selection.marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			selection.marker.setAnimation(null);
		}, 1400);// the bouce should stop after a few bouces.

	};
	//this function is triggered when user click a place name in the list.
	this.select = function(clickedPlace) {
		self.handleInfo(clickedPlace);
	};
};



ko.applyBindings(new ViewModel());






