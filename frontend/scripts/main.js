var map;
var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById('myModal');
var markers_array = [];
var clickedLat;
var clickedLng;

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
        
        google.maps.event.addListener(map, 'click', function(event) {
        	var lat = event.latLng.lat();
        	var lng = event.latLng.lng();
        	
            clickedLat = lat;
            clickedLng = lng;

        	modal.style.display = "block";
        });
        

    	load_markers();

    },function(){
    		console.log("navigation failed");
    });
}

span.onclick = function() {
    modal.style.display = "none";
}

function load_markers() {
    $.ajax({
            url: 'http://localhost:8080/api/markers',
            type: 'GET',
            success: callback
        }); 
}

function post_callback(data) {
    console.log("Marker created");
}

function submit_marker() {
    
    var postObject = {
        x_coordinate: clickedLat,
        y_coordinate: clickedLng,
        title: document.getElementById('form-title').value,
        message: document.getElementById('form-comment').value,
        type: document.getElementById('form-type').value,
        creation_time: Date.now(),
        times_flagged: 0,
        times_like: 0,
    };

    
    $.ajax({
        url : 'http://localhost:8080/api/markers',
        type: "POST",
        data : postObject,
        success: function(data, status, xhr) {
            // data - what we get back from server
            console.log(data);
            console.log(status);
            addMarker(event.latLng)
        },
        error: function(xhr, status, err) {
            // do some logging
        }
    });

    reload_markers();
    
    return false;
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

        markers_array.push(map_marker);

        google.maps.event.addListener(map_marker, 'click', function() {
            this.infowindow.open(map, this);
        });

        
    }    
    // set up the infoWindow
    //---------------------------------------------------------
       
    //-----------------------------------------------------------
}

function clear_markers() {
    for (var i = 0; i < markers_array.length; i++) {
        markers_array[i].setMap(null);
    }
    markers_array.length = 0;
}

function reload_markers() {
    clear_markers();
    load_markers();
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
