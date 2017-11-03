//create list of places to show in the app.
let places = [
	{name: 'Brisbane Town Hall', location: {lat:-27.468657, lng:153.023913}, key:'Brisbane Town Hall'},
	{name: 'Cartier Brisbane', location: {lat:-27.469351, lng:153.027776}, key:'Cartier'},
	{name: 'UQ', location: {lat:-27.496638, lng:153.013013}, key:'University of Queensland'},
	{name:'QUT', location:{lat:-27.477236, lng:153.028511}, key:'Queensland University of Technology'},
	{name: 'James Cook U', location: {lat:-27.466698, lng:153.029495}, key:'James Cook University'}
];

let map, createMarkers, handleInfo;

//Handler for clicks on list item or markers.
handleInfo = function(selection) {
	places.forEach(function(place) {
			place.info.close();
		});
	selection.info.open(map, selection.marker);
	selection.marker.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function() {
		selection.marker.setAnimation(null);
	}, 1800);// the bouce should stop after a few bouces.

};


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

let Place = function(data) {
	this.name = ko.observable(data.name);
	this.location = ko.observable(data.location);
};

let ViewModel = function() {
	let self = this;
	this.list = ko.observableArray([]);
	places.forEach(function(placeItem) {
		self.list.push(new Place(placeItem) );
	});	

	//for each place in the list, create a marker on the map.
	createMarkers = function() {
		places.forEach(function(place) { 
			place.marker = new google.maps.Marker({
				position: place.location,
				map:map,
				title: place.name,
				animation: google.maps.Animation.DROP
			});


			//request information for each place from unsplash.
			$.ajax({
				url: 'https://api.unsplash.com/search/photos?page=1&query='+place.key,
				headers: {Authorization:'Client-ID 3263ef8348ae2fde9bbef8765f3bc3bd71856d5e9a19bc7ae6390c320dbdb351'},
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
				handleInfo(place);
	  		});
		});
	};

	//this function is triggered when user click a place name in the list.
	this.select = function(clickedPlace) {
		handleInfo(clickedPlace);
	};
};


$(document).ready(function(){
	//show the list when user click the burger icon.
	$('#icon').click(function() {
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
		
	});

});

//function use to filter the list and markers.
// inspired by https://www.w3schools.com/howto/howto_js_filter_lists.asp
function filteration() {
    var input, filter, ul, li, i;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById('list');
    li = ul.getElementsByTagName('li');

    // Loop through all the places in the list, and hide places according to user input.
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            places[i].marker.setMap(map);// show the corresponding marker again if use delete input.
        } else {
            li[i].style.display = "none";// hide list item according to user input.
            places[i].marker.setMap(null);// hide the corresponding marker on the map.
        }
    }
}



ko.applyBindings(new ViewModel());






