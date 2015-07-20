var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShowSchema  = new Schema({
    name: { type: String, required: true },
    media: [{ type: Schema.Types.ObjectId, ref: 'Media'}],
    tags: [{ type: String }],
    path: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

});

ShowSchema.pre('save', function(next) {
    var show = this;
    console.log('Saving ' + show.name );
    this.updated_at = Date.now();
    next();
});

// return the model
module.exports = mongoose.model('Show', ShowSchema);
