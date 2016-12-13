var io = require('fs');
var _ = require('lodash');
var Promise = require('promise');
var data = {};
var characters = undefined;
var itemData = undefined;

data.getCharacter = function (characterID){
    return new Promise(function (resolve, reject) {
        if (characters == undefined) {
            io.readFile("./data/json/characters.json", 'utf8', function (err, data) {
                var jsonRead = JSON.parse(data);
                characters = jsonRead;
                var characterFound = _.find(characters, { id: characterID });
                if (characterFound == null) reject("Character Not Found");
                else resolve(characterFound);
            });
        } else {
            var characterFound = _.find(characters, { id: characterID });
            if (characterFound == null) reject("Character Not Found");
            else resolve(characterFound);
        }
    });
}

data.getItemData = function (itemId) {
    return new Promise(function (resolve, reject) {
        if (itemData == undefined) {
            io.readFile("./data/json/items.json", 'utf8', function (err, data) {
                var jsonRead = JSON.parse(data);
                itemData = jsonRead;
                var itemFound = _.find(itemData, { id: itemId });
                if (itemFound == null) reject("Item Not Found");
                else resolve(itemFound);
            });
        } else {
            var itemFound = _.find(itemData, { id: itemId });
            if (itemFound == null) reject("Item Not Found");
            else resolve(itemFound);
        }
    });
}

data.putCharacter = function (){
    return new Promise(function (resolve, reject) {
        if (characters == undefined) reject("Not initialized yet, retry soon");
        else {
            io.writeFile("./data/json/characters.json", JSON.stringify(characters, null, '\t'), 'utf8', function (err) {
                resolve("Successfully saved");
            });
        }
    });
}

data.getInventory = function (characterID){
    return new Promise(function (resolve, reject) {
        data.getCharacter(characterID).then(function (result) {
            resolve(result.inventory);
        }, function (error) {
            reject(error);
        });
    });
}

data.getBalance = function (characterID){
    return new Promise(function (resolve, reject) {
        data.getCharacter(characterID).then(function (result) {
            resolve(result.balance);
        }, function (error) {
            reject(error);
        });
    });
}

data.putBalance = function (characterID, balanceChange){
    return new Promise(function (resolve, reject) {
        data.getCharacter(characterID).then(function (result) {
            if (result.balance + balanceChange < 0) reject("Could not update balance, new value would be negative");
            result.balance += balanceChange;
            data.putCharacter().then(function (_result) {
                resolve(result.balance);
            }, function (error) {
                reject(error)
            });
            //resolve(result.balance);
        }, function (error) {
            reject(error);
        });
    });
}

data.updateItemCondition = function (characterID, specificItemID, newCondition){
    return new Promise(function (resolve, reject) {
        if (newCondition < 0) reject("Cannot set a negative condition");
        data.getCharacter(characterID).then(function (result) {
            if (result == null) reject("Character not found");
            var item_toUpdate = _.find(result.inventory, { specificItemId: specificItemID });
            if (item_toUpdate == null) reject("Item not found");
            item_toUpdate.condition = newCondition;
            data.putCharacter().then(function (_result) {
                resolve(_result);
            }, function (error) {
                reject(error)
            });
            //resolve(result.balance);
        }, function (error) {
            reject(error);
        });
    });
}


module.exports = data;