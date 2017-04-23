//server.js
//Base setup
//======================================================================
var express = require('express');
var app     = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds115870.mlab.com:15870/bear');
var Marker = require('./app/models/marker');

//ROUTES
//======================================================================
var router = express.Router();

//middleware

router.use(
    function(req,res,next){
        
        // Cross Origin Requests CORS
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        console.log('someting is happening.')
        next();
    }
);


router.get('/',function(req,res){
         res.json({message:"we3lcome to MarktheMap"});
    }
);

//---------------------------------------------------------------------
//ROUTE FOR CONTROL OVER ALL THE MARKERS ||||| ROUTE: /markers

router.route('/markers')

    //create a marker
	.post(function(req,res){
		var marker = new Marker();
		marker.x_coordinate  = req.body.x_coordinate;
		marker.y_coordinate  = req.body.y_coordinate;
		marker.title         = req.body.title;
		marker.message       = req.body.message;
		marker.type          = req.body.type;
		marker.creation_time = req.body.time;
		marker.times_flagged = 0;
		marker.times_like    = 0;

		marker.save(function(err, marker){
			if(err)
				res.send(err);
			res.json({
                data: marker,
                message:"marker placed!"
            });
		});
	})


	//get all the marker


	.get(function(req,res){
		Marker.find(function(err,markers){
            if(err)
                res.send(err);

            res.json(markers);     
			
		});
	})

	

//----------------------------------------------------------------------------------
//Searching for markers with the specific title or types |||| ROUTE: /markers/search

router.route('/markers/search')
    .get(function(req, res){
     //console.log(req.query.title)
     //console.log(req.query.type)
        if(typeof req.query.type != "undefined"){
            Marker.findByType(req.query.type, function(err, marker){
        	    console.log("searching type");
        	    if(err)
        		    res.send(err);
        	    res.json(marker);
            });
        }

        if(typeof req.query.title != "undefined"){
            Marker.findByTitle(req.query.title, function(err, marker){
        	    console.log("searching title")
        	    if(err)
        		    res.send(err);
        	    res.json(marker);
        });
    }
})


//------------------------------------------------------------------
//CONTROL OVER A SINGLE MARKER |||| ROUTE: /markers/:marker_id
router.route('/markers/:marker_id')

    //get marker with a specific id
    .get(function(req,res){
    	Marker.findById(req.params.marker_id, function(err, marker){
             if(err)
             	res.send(err);
             res.json(marker);
    	});
    })

    .put(function(req, res) {

        
        Marker.findById(req.params.marker_id, function(err, marker) {

            if (err)
                res.send(err);

            marker.x_coordinate  = req.body.x;
			marker.y_coordinate  = req.body.y;
			marker.title         = req.body.title;
			marker.message       = req.body.message;
			marker.type          = req.body.type;
			marker.creation_time = req.body.time;
			marker.times_flagged = req.body.flags;

            marker.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Marker updated!' });
            });

        });
    })

    .delete(function(req, res) {
    	var title = req.body.title;

        Marker.remove({
            _id: req.params.bear_id
        }, function(err, marker) {
            if (err)
                res.send(err);

            // console.log(title);
            res.json({ message: 'Marker: ' + title + ' has been deleted'});
        });
    });

//---------------------------------------------------------------------------------
//Add flag or like to a marker|||| ROUTE: /Marker/:marker_id/flag & /Marker/:marker_id/like

router.route('/markers/:marker_id/flag')
    .put(function(req,res){
    	Marker.findById(req.params.marker_id, function(err, marker){
            
            if(err)
            	res.send(err);
            marker.addflag();
        
            marker.save(function(err){
                if(err)
                	res.send(err);

                res.json({ message: 'flag placed'});
            });
        });
    })

router.route('/markers/:marker_id/like')
    .put(function(req,res){
    	Marker.findById(req.params.marker_id, function(err, marker){
            
            if(err)
            	res.send(err);
            marker.addlike();
        
            marker.save(function(err){
                if(err)
                	res.send(err);

                res.json({ message: 'like placed'});
            });
        });
    });

//-------------------------------------------------------------------
//REGISTER ROUTES

app.use('/api',router);




//START THE SEREVER
//====================================================================
app.listen(port);
console.log('server start at'+port)