
function initMap() {
	let map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.586045 , lng:110.035802},
		zoom: 13
         });

	let MZloc = {lat:40.586045 , lng:110.035802};
	let MZmarker = new google.maps.Marker({
            position: MZloc,
            map: map,
            title: 'MZ Hospital'
		});
}

