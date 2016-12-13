var io = require('fs');
var _ = require('lodash');
var Promise = require('promise');
var data = require('./data/data_access.js');

var game = {};

game.useItem = function (characterID, specificItemID_toUse){
    return new Promise(function (resolve, reject) {
        data.getCharacter(characterID).then(function (result) {
            var itemToUse = _.find(result, { specificItemID: specificItemID_toUse });
            if (itemToUse == null) reject("Character does not have this item");
            data.getItemData(itemToUse.id).then(function (itemDefinition) {
                var newCondition = itemToUse.condition - itemDefinition.decay;
                if (newCondition < 0) reject("Cannot use item - condition too low");
                
                var personalLootUpdate = itemDefinition.decay * 0.90;
                var globalLootUpdate = itemDefinition.decay * 0.05;
            }, function (error) {
                        
            });
        }, function (error) {

        });
    });
}

module.exports = game;