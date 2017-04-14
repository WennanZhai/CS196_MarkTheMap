var map;

function initMap() {
    
    //store user's position in variable pos
    navigator.geolocation.getCurrentPosition(function(position){
    	console.log(position.coords.latitude)
    	console.log(position.coords.longitude)
    	var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
    //set up the map 
        map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: pos
        });
        
        google.maps.event.addListener(map, 'rightclick', function(event) {
        	console.log(event.latLng.lat());
        	console.log(event.latLng.lng());
        	addMarker(event.latLng);
        });
        

    	$.ajax({
        	url: 'http://localhost:8080/api/markers',
        	type: 'GET',
        	success: callback
    	});	

    },function(){
    		console.log("navigation failed");
    });
}

function post_callback(data) {
    console.log("Marker created");
}

function callback(data) {
    console.log(data);

    for(var i = 0; i < data.length; i++) {
        var marker = data[i];

        var marker_pos = {
            lat: marker.x_coordinate,
            lng: marker.y_coordinate
        }

        console.log(marker_pos);
    
        var contentString = 
        
        '<h1 id="info_title">'+marker.title+'</h1>'+
        '<p id="info_type">Type: '+marker.type+'</p>'+
        '<p id="info_time">Time created: '+marker.time+'</p>'+

        '<p id="info_message">    '+marker.message+'</p>' ;

        var myinfowindow = new google.maps.InfoWindow({
            content:contentString,
            maxWidth: 210
        });

        var map_marker = new google.maps.Marker( {
            position: marker_pos,
            map: map,
            title: marker.title,
            type: marker.type,
            time: marker.creation_time,
            flag: marker.times_flagged,
            like: marker.times_like,
            infowindow: myinfowindow
        });

        google.maps.event.addListener(map_marker, 'click', function() {
            this.infowindow.open(map, this);
        });
    }    
    // set up the infoWindow
    //---------------------------------------------------------
       
    //-----------------------------------------------------------
}

function addMarker(location) {
    var new_marker = new google.maps.Marker({
        position: location,
        map: map
    });
/*    
    $.ajax({
        type: "POST",
        url: 'http://localhost:8080/api/markers',
        data: !!!!!
        success: post_callback
});
*/

}
