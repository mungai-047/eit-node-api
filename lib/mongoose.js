let mongoose= require('mongoose');

mongoose.connect('mongodb://eit-app-mongo.westeurope.azurecontainer.io:27017/eit');
let db = mongoose.connection;

db.on('error', function (err) {
    //log.error('connection error:', err.message);
    console.log('connection error');
});
db.once('open', function callback () {
    //log.info("Connected to DB!");
     console.log('Connected to DB!');
});

let Schema = mongoose.Schema;

let eit = new Schema({
    firstName: { type: String, required: true },
    surName: { type: String, required: true },
    age: { type: String, required: true },
    country: { type: String, required: true }
});

eit.path('firstName').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

let eitModel = mongoose.model('eit', eit);

module.exports.eitModel = eitModel;

