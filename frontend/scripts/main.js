var map;

function initMap() {
    
    //import InfoBox.js
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "../scripts/infobox.js";
    $("head").append(s);
    
    //store user's position in variable pos
    navigator.geolocation.getCurrentPosition(function(position) {
    	console.log(position.coords.latitude)
    	console.log(position.coords.longitude)
    	var pos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
        )
        
        //set up the map 
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: pos
        });
        
        //GET data(markers) from the database 
    	$.ajax({
        	url: 'http://localhost:8080/api/markers',
        	type: 'GET',
        	success: callback
    	});	
        
        //right click on the map to call addMarker function  
        google.maps.event.addListener(map, 'rightclick', function(event) {
        	console.log(event.LatLng.lat());
        	console.log(event.LatLng.lng());
        	addMarker(event.LatLng);
        });
        

    },function(){
            console.log("navigation failed");
    });
}

function callback(data) {
    console.log(data);

    for(var i = 0; i < data.length; i++) {
        var marker = data[i];

        var marker_pos = new google.maps.LatLng(
            marker.x_coordinate,
            marker.y_coordinate
        );
        
        console.log(marker_pos);
    
        var contentString = 
        
        '<h1 id="info_title">'+marker.title+'</h1>'+
        '<p id="info_type">Type: '+marker.type+'</p>'+
        '<p id="info_time">Time created: '+marker.time+'</p>'+
        '<p id="info_message">    '+marker.message+'</p>' ;
        
        //using InfoBox instead of InfoWindow to show contentString
        //myoption is settings for InfoBox
        var myoption = {
            content: contentString,
            position: marker_pos,
            maxWidth: "220px",
            alignBottom: true,
            pixelOffset: new google.maps.Size(-100,-50),
            closeBoxURL: "",
            boxClass: "BoxStyle",
        }
        
        var map_marker = new google.maps.Marker({
            position: marker_pos,
            map: map,
            title: marker.title,
            content: contentString,
            type: marker.type,
            time: marker.creation_time,
            flag: marker.times_flagged,
            like: marker.times_like,
            infobox: new InfoBox(myoption)
        });
        
        //click markers to show the InfoBox
        google.maps.event.addListener(map_marker, 'mouseover', function(map_marker) {
            this.infobox.open(map, this);
        });
        google.maps.event.addListener(map_marker, 'mouseout', function(map_marker){
            this.infobox.close();
        });
        
    }    
    // set up the InfoBox
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
        url: 'http://localhost:8080/api/markers',
        type: "POST",
        data: new_markerDB
        success: post_callback
});
*/

}

function post_callback(data) {
    console.log("Marker created");
}
