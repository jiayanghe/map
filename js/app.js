let places = [
	{name: 'Brisbane Town Hall', location: {lat:-27.468657, lng:153.023913}, key:'apple'},
	{name: 'Cartier Brisbane', location: {lat:-27.469351, lng:153.027776}, key:'humming bird'},
	{name: 'UQ', location: {lat:-27.496638, lng:153.013013}, key:'subaru'},
	{name:'QUT', location:{lat:-27.477236, lng:153.028511}, key:'fuji'},
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
	}, 2800);

};



function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:-27.468657, lng:153.023913},
		zoom: 13
         });
	createMarkers();
};

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

	createMarkers = function() {
		places.forEach(function(place) { 
			place.marker = new google.maps.Marker({
				position: place.location,
				map:map,
				title: place.name,
				animation: google.maps.Animation.DROP
			});


			let wikiUrl = 'http://en.wikipedia.org//w/api.php?action=query&format=json&prop=images&titles='+place.key+'&callback=?';

			$.ajax({
				url: wikiUrl,
				dataType: "jsonp",
				/*
				success: function(response) {
					//let articleList = response[1];
					//articleStr = articleList[1];
					place.info.setContent('<img src='+ response.results[0].url + '></img>');
				}*/
			}).done(addImg);

			function addImg(data) {
				let image = '<img src='+ data.results[1].url + '></img>'
				place.info.setContent(image);
			}


			/*
			$.ajax({
			        type: "GET",
			        url: "/w/api.php?action=query&format=json&prop=images&titles=Albert%20Einstein",
			        contentType: "application/json; charset=utf-8",
			        async: false,
			        dataType: "json",
			        success: function (data, textStatus, jqXHR) {
			 
			            var markup = data.parse.text["*"];
			            var blurb = $('<div></div>').html(markup);
			 
			            // remove links as they will not work
			            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
			 
			            // remove any references
			            blurb.find('sup').remove();
			 
			            // remove cite error
			            blurb.find('.mw-ext-cite-error').remove();
			            place.info.setContent(markup);
			 
			        },
			        error: function (errorMessage) {
			        }
			    });
			    */

			place.info = new google.maps.InfoWindow({
				//content: info collected from wikiPedia.
			});

			place.marker.addListener('click', function() {
				handleInfo(place);
	  		});
		});
	};

	this.select = function(clickedPlace) {
		handleInfo(clickedPlace);
	};
}


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
		};
		
	});

});

function filteration() {
    var input, filter, ul, li, i;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById('list');
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            places[i].marker.setMap(map);
        } else {
            li[i].style.display = "none";
            places[i].marker.setMap(null);
        };
    }
}



ko.applyBindings(new ViewModel());

/*
let wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+places[3].name+'&format=json&callback=wikiCallback';

$.ajax({
	url: wikiUrl,
	dataType: "jsonp",
	success: function(response) {
		let articleList = response[1];
		articleStr = articleList[1];
		places[0].info.setContent(articleStr);
	}
});
*/

/*
$.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Jimi_Hendrix&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
 
            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);
 
            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
 
            // remove any references
            blurb.find('sup').remove();
 
            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            $('.test').html($(blurb).find('p'));
 
        },
        error: function (errorMessage) {
        }
    });
*/





