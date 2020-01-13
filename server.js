let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let logger = require('morgan');
let swaggerUi = require('swagger-ui-express');
let swaggerDocument = require('./swagger.json');

let app = express();

app.use(methodOverride());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


let eitModel = require('./lib/mongoose').eitModel;

app.get('/eits', function (req, res) {

    return eitModel.find(function (err, eits) {
        if (!err) {
            return res.send(eits);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});


app.post('/eit', function (req, res) {

    let eit= new eitModel({
        firstName:req.body.firstName,
        surName: req.body.surName,
        age: req.body.age,
        country: req.body.country
    });
    eit.save();

    res.send({ status: 'OK', eit:eit });

});


app.put('/eit', function (req, res) {

    return eitModel.findById(req.body.id, function (err, eit) {
        if(!eit) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        eit.firstName = req.body.firstName;
        eit.surName = req.body.surName;
        eit.age = req.body.age;
        eit.country = req.body.country;

        return eit.save(function (err) {
            if (!err) {
                return res.send({ status: 'OK', eit:eit });
            }
        });
    });

});

app.delete('/eit', function (req, res) {

   return eitModel.findById(req.body.id, function (err, eit) {
        if(!eit) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return eit.remove(function (err) {
            if (!err) {
                return res.send({ status: 'OK', eit:eit });
            }
        });
    });
});

app.listen(80, function(){

    console.log('EIT App listening on  http://localhost');
});
