/**
 * Validate empty input
 *
 * ****** Caution: Returned value must be Boolean !
 */


/**
 * Check if string is empty '' or number is zero 0.
 * @param  {String} pathValue - path value of doc to be inserted
 *
 * @return {Boolean}    - returned value must be true or false
 */
module.exports.isEmpty = () => {
  return (pathValue) => {
    return !!pathValue;
  };
};



/**
 * Check if array is empty [].
 * @param  {String} pathValue - path value of doc to be inserted
 *
 * @return {Boolean}    - returned value must be true or false
 */
module.exports.isEmptyArray = () => {
  return (pathValue) => {
    return (pathValue.length !== 0);
  };
};


/**
 * Check if path already exist
 * @param  {String} modelName - model to be applied, for example 'usersMD'
 * @param  {String} path - document's path for example 'email'
 *
 * @return {Boolean}    - returned value must be true or false
 */
module.exports.alreadyExist = (modelName, path) => {

  return (pathValue, next) => {
    //define query object, for example: queryObj = {email: pathValue}
    const queryObj = {};
    queryObj[path] = pathValue;

    this.model(modelName).countDocuments(queryObj, (err, count) => {
      if (err) {
        return next(err);
      }
      // If `count` is greater than zero, "invalidate"
      next(!count);
    });
  };
};


