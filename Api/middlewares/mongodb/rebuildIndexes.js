/**
 * Rebuild indexes for one model (collection)
 * @param  {Object} modelName - for example: usersModel
 */
module.exports.oneModel = (modelName) => {
  modelName.collection.dropIndexes().then(() => modelName.createIndexes());
};



/**
 * Rebuild indexes for all models (collections)
 */
module.exports.allModels = () => {
  const mongoose = require('mongoose');
  console.log('NODE_RIND=true - Mongo indexes rebuild for: ', mongoose.modelNames());

  const modelsArr = mongoose.modelNames();
  /*
    [
        'usersMD',
        'settingsMD',
        'plansMD',
        'dbmoDatabasesMD',
        'dbmoCollectionsMD',
        'dbmoEndpointsMD',
        'dbmoEndpointsAvailableMD',
        'emailServersMD',
        'emailEndpointsAvailableMD',
        'emailEndpointsMD',
        'authGroupsMD',
        'authUsersMD',
        'authEndpointsAvailableMD',
        'authEndpointsMD'
    ]
     */

  modelsArr.forEach(mdl => {
    mongoose.model(mdl).collection.dropIndexes().then(() => mongoose.model(mdl).createIndexes());
  });


};
