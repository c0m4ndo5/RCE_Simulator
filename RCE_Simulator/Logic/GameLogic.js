var io = require('fs');
var _ = require('lodash');
var Promise = require('es6-promise');
var data = require('../data/data_access.js');

var game = {};

//LOOT DEFINITION

//Base chance to get any loot, modified according to costs/type of activity
var BASE_CHANCE_MINING = 0.25;

//When loot is generated, chance for each range of loot
var LOOT_BAND_EPIC = 0.9999;
var LOOT_BAND_HIGH = 0.99;
var LOOT_BAND_MID = 0.6;
var LOOT_BAND_LOW = 0.2;
var LOOT_BAND_TINY = 0.0;

game.useItem = function (characterID, specificItemID_toUse){
    return new Promise(function (resolve, reject) {
        data.getCharacter(characterID).then(function (result) {
            var itemToUse = _.find(result.inventory, { specificItemId: specificItemID_toUse });
            if (itemToUse == null) reject("Character does not have this item");
            data.getItemData(itemToUse.itemId).then(function (itemDefinition) {
                var newCondition = itemToUse.condition - itemDefinition.decay;
                if (newCondition < 0) reject("Cannot use item - condition too low");
                
                var personalLootUpdate = itemDefinition.decay * 0.90;
                var globalLootUpdate = itemDefinition.decay * 0.05;
                
                var updates = [];
                updates.push(data.updateItemCondition(characterID, specificItemID_toUse, newCondition));
                updates.push(data.putPersonalLootBalance(characterID, personalLootUpdate));
                updates.push(data.updateSharedPool(globalLootUpdate));
                
                Promise.all(updates).then(function (success) {
                    resolve("Item successfully used");
                }, function (error) {
                    resolve("Failed to use item " + error.toString());
                });
            }, function (error) {
                reject(error)
            });
        }, function (error) {
            reject(error)
        });
    });
}

game.generateMiningLoot = function (characterID, cost){
    return new Promise(function (resolve, reject) {
        Promise.all([data.getCharacter(characterID), data.getSharedPool()]).then(function (success) {
            var characterSelected = success[0];
            var sharedPool = success[1];
            var newLoot = {
                lootValue: 0,
                lootCost: cost,
                lootType: "mining"
            };
            
            var isLoot = Math.random() < BASE_CHANCE_MINING;
            if (isLoot) {
                var lootBand = Math.random();
                
                //select loot band
                switch (true) {
                    case lootBand > LOOT_BAND_HIGH:
                        
                        break;
                    
                }
            }

        }, function (error) {
            reject(error)
        });

    });
}

module.exports = game;