var io = require('fs');
var _ = require('lodash');
var Promise = require('es6-promise');
var data = {};
var characters = undefined;
var itemData = undefined;
var sharedPoolVal = undefined;

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
                var itemFound = _.find(itemData.items, { id: itemId });
                if (itemFound == null) reject("Item Not Found");
                else resolve(itemFound);
            });
        } else {
            var itemFound = _.find(itemData.items, { id: itemId });
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
        }, function (error) {
            reject(error);
        });
    });
}

data.putPersonalLootBalance = function (characterID, balanceChange) {
    return new Promise(function (resolve, reject) {
        data.getCharacter(characterID).then(function (result) {
            result.lootpool_balance += balanceChange;
            data.putCharacter().then(function (_result) {
                resolve(result.lootpool_balance);
            }, function (error) {
                reject(error)
            });
        }, function (error) {
            reject(error);
        });
    });
}

data.updatePersonalLoot = function (characterID, lootValue, lootCost, lootType){
    return new Promise(function (resolve, reject) {
        data.getCharacter(characterID).then(function (result) {
            if (result.pendingLoot == null) result.pendingLoot = [];
            result.pendingLoot.push({
                lootValue: lootValue,
                lootCost: lootCost,
                lootType: lootType
            });
            data.putCharacter().then(function (_result) {
                resolve("Loot saved");
            }, function (error) {
                reject(error)
            });
        }, function (error) {
            reject(error);
        });
    });
}

data.getPersonalLoot = function (characterID, lootCost, lootType){
    return new Promise(function (resolve, reject) {
        data.getCharacter(characterID).then(function (result) {
            if (result.pendingLoot == null) reject("No loot to get");
            var lootReturned = _.find(result.pendingLoot, { lootCost: lootCost, lootType: lootType });
            if (lootReturned.length > 0) {
                data.putCharacter().then(function (_result) {
                    resolve(lootReturned[0]);
                }, function (error) {
                    reject(error)
                });
            }
            else reject("No loot to get");
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

data.getSharedPool = function () {
    return new Promise(function (resolve, reject) {
        if (sharedPoolVal == undefined) {
            io.readFile("./data/json/shared_lootpool.json", 'utf8', function (err, data) {
                var jsonRead = JSON.parse(data);
                if (jsonRead.sharedLootpool_value == null) reject("Error getting shared loot value");
                sharedPoolVal = jsonRead.sharedLootpool_value;
                resolve(sharedPoolVal);
            });
        } else {
            resolve(sharedPoolVal);
        }
    });
}

data.updateSharedPool = function (balanceChange) {
    return new Promise(function (resolve, reject) {
        if (sharedPoolVal == undefined) {
            data.getSharedPool().then(function (success) {
                sharedPoolVal += balanceChange;
                
                var objectToSave = { "sharedLootpool_value": sharedPoolVal };
                io.writeFile("./data/json/shared_lootpool.json", JSON.stringify(objectToSave, null, '\t'), 'utf8', function (err) {
                    resolve("Successfully saved");
                });
            }, function (error) {
                reject("Failed to initialize loot pool");
            });
            
        }
        else {
            sharedPoolVal += balanceChange;

            var objectToSave = {"sharedLootpool_value": sharedPoolVal};
            io.writeFile("./data/json/shared_lootpool.json", JSON.stringify(objectToSave, null, '\t'), 'utf8', function (err) {
                resolve("Successfully saved");
            });
        }
    });
}

module.exports = data;