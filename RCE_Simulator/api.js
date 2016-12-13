var express = require('express');
var router = express.Router();
var data = require('./data/data_access.js');

router.get('/inventory/:id', function (req, res) {
    //res.end(JSON.stringify({ message: 'Hello World' }));
    data.getInventory(parseInt(req.params.id)).then(function (result) {
        res.send(result);
    }, function (error) {
        res.send(error)
    });
});

router.get('/testBalance/:id/:value', function (req, res) {
    data.putBalance(parseInt(req.params.id), parseFloat(req.params.value)).then(function (result) {
        res.send(result.toString());
    }, function (error) {
        res.send(error);
    });
});

router.get('/useItem/:charID/:specificItemID', function (req, res) {
    
});

module.exports = router;