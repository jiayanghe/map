let places = [
	{name: 'Brisbane Town Hall', location: {lat:-27.468657, lng:153.023913}},
	{name: 'Cartier Brisbane', location: {lat:-27.469351, lng:153.027776}},
	{name: 'UQ', location: {lat:-27.496638, lng:153.013013}},
	{name:'QUT', location:{lat:-27.477236, lng:153.028511}},
	{name: 'James Cook U', location: {lat:-27.466698, lng:153.029495}}
];

function initMap() {
	let map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:-27.468657, lng:153.023913},
		zoom: 13
         });

	places.forEach(function(place) { 
		new google.maps.Marker({
			position: place.location,
			map:map,
			title: place.name,
			animation: google.maps.Animation.DROP
		});
	});
}

let Place = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
}

let ViewModel = function() {
	let self = this;
	this.list = ko.observableArray([]);
	places.forEach(function(placeItem) {
		self.list.push(new Place(placeItem) );
	});	
}


$(document).ready(function(){
	//show the list when user click the burger icon.
	$('#icon').click(function() {
		$('#menu').toggleClass('hide');
		let map = document.getElementById('map');
		//shrink the map when the list shows.
		if (map.classList.contains('movemap')) {
			document.getElementById('map').classList.remove('movemap');
			document.getElementById('map').classList.add('loc');
		//expand the map when the list hides.
		}else {
			document.getElementById('map').classList.remove('loc');
			document.getElementById('map').classList.add('movemap');
		};
		
	});

});

ko.applyBindings(new ViewModel());



