
//-------------------------------------------------------------------------------
//Load the library and functions we need


var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


//-------------------------------------------------------------------------------
//Basic set up of the Schema



var MarkerSchema = new Schema({
    x_coordinate: Number,
    y_coordinate: Number,
    title: String,
    message: String,
    type: String,
    creation_time: Date,
  //creator: User
    times_flagged: Number,
    times_like: Number,
})




//--------------------------------------------------------------------------------
//Finding functions used to get markers that share a specific attribute



MarkerSchema.statics.findByType = function(type_search, cb) {
	return this.find({type: type_search},cb);
};

MarkerSchema.statics.findByTitle = function(title_search, cb){
    return this.find({title: title_search},cb);
};

MarkerSchema.statics.findByCoordinate = function(x, y, cb){
    return this.find({x_coordinate:x, y:y_coordinate},cb);
};

MarkerSchema.statics.findByCreationTime = function(time_search, cb){
    return this.find({creation_time:time_search}, cb);
};

MarkerSchema.statics.findByTimesFlagged = function(flag_search, cb){
    return this.find({times_flagged:flag_search}, cb);
};

MarkerSchema.statics.findByTimesFlagged = function(like_search, cb){
    return this.find({times_like:like_search}, cb);
};



//increment times_flagged or times_like
//--------------------------------------------------------------------------------


MarkerSchema.methods.addflag = function(){
    this.times_flagged++;
};

MarkerSchema.methods.addlike = function(){
    this.times_like++;
};


//-------------------------------------------------------------------------------
//Export the Schema

module.exports = mongoose.model('Marker',MarkerSchema);