var express = require('express');
var router = express.Router();
var data = require('./data/data_access.js');
var gameLogic = require('./Logic/GameLogic.js');

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
    gameLogic.useItem(parseInt(req.params.charID), parseInt(req.params.specificItemID)).then(function (success) {
        res.send(success.toString());
    }, function (error) {
        res.send(error.toString());
    });
});

module.exports = router;