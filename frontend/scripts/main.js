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

function close_popWindow() {
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
    close_popWindow();
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
                    '<div id="iw-container">' +
                    '<div class="iw-title">'+marker.title+'</div>' +
                    '<div class="iw-content">' +
                        '<div class="infowindow">'+
                        '<ul>'+
                            '<li><a id="smalltitle">Type:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </a></li>'+
                            '<li><a>'+marker.type+'</a></li>'+
                        '</ul>'+
                        '<ul>'+
                            '<li><a id="smalltitle">Time created:</a></li>'+
                            '<li><a>'+marker.time+'</a></li>'+
                        '</ul>'+
                        '<p id="infocontent">'+marker.message+'</p>'+
                        '</div>'+
                    '</div>' +
                    '<div class="iw-bottom-gradient"></div>' +
                    '</div>';

        var myinfowindow = new google.maps.InfoWindow({
            content:contentString,
            maxWidth: 350
        });

        var map_marker = new google.maps.Marker( {
            id:marker._id,
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
        var open = false;
        google.maps.event.addListener(map_marker, 'click', function() {
            this.infowindow.open(map, this);
            open = true;
        });

        google.maps.event.addListener(map_marker, 'mouseover',function(){
        	this.infowindow.open(map, this);
        	open = false;
        })

        google.maps.event.addListener(map_marker, 'mouseout', function(){
        	if (!open){
        		this.infowindow.close(map, this);
        	}
        })
        google.maps.event.addListener(map_marker,'rightclick',function(){
            delete_marker(this.id);
        });

        google.maps.event.addListener(myinfowindow, 'domready', function() {
    
    // Reference to the DIV that wraps the bottom of infowindow
    var iwOuter = $('.gm-style-iw');

    /* Since this div is in a position prior to .gm-div style-iw.
     * We use jQuery and create a iwBackground variable,
     * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
    */
    var iwBackground = iwOuter.prev();

    // Removes background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});

    // Removes white background DIV
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

    // Moves the infowindow 115px to the right.
    iwOuter.parent().parent().css({left: '115px'});

    // Moves the shadow of the arrow 76px to the left margin.
    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

    // Moves the arrow 76px to the left margin.
    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

    // Changes the desired tail shadow color.
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

    // Reference to the div that groups the close button elements.
    var iwCloseBtn = iwOuter.next();

    // Apply the desired effect to the close button
    iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});

    // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
    if($('.iw-content').height() < 140){
      $('.iw-bottom-gradient').css({display: 'none'});
    }

    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
    iwCloseBtn.mouseout(function(){
      $(this).css({opacity: '1'});
    });
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

}

function load_type(type){
    clear_markers();
    $.ajax({
        url: 'http://localhost:8080/api/markers/search?type='+type,
        type: 'GET',
        success: callback
    }); 
}

function show_all(){
    clear_markers();
    reload_markers();
}

function adjust_textarea(h) {
    h.style.height = "20px";
    h.style.height = (h.scrollHeight)+"px";
}

function delete_marker(id){
    $.ajax({
        url: 'http://localhost:8080/api/markers/'+id,
        type: 'delete',
        success: delete_callback
    }); 
    clear_markers();
    reload_markers();
}

function delete_callback(data){
    console.log("delete success");
}

