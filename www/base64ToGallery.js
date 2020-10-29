/**
 * @file base64ToGallery PhoneGap/Cordova plugin
 * @author Tommy-Carlos Williams
 * @author Simba Zhang <solderzzc@gmail.com>
 * @author StefanoMagrassi <stefano.magrassi@gmail.com>
 * @copyright Tommy-Carlos Williams 2012. All rights reserved.
 * @license MIT
 */

var exec = require('cordova/exec');
var assign = require('./object.assign-polyfill');

// Consts
var SERVICE  = 'Base64ToGallery';
var ACTION   = 'saveImageDataToLibrary';
var ARGS     = ['data', 'prefix', 'mediaScanner', 'type'];
var DEFAULTS = { prefix: 'img_', mediaScanner: true };

/**
 * @property indexFromArgs - Partially applied "indexFrom" method with ARGS constant.
 * @private
 */
var indexFromArgs = indexFrom.bind(null, ARGS);

/**
 * Saves base64 data as image.
 * @public
 * @param  {string}   data
 * @param  {string}   [prefix]
 * @param  {function} [success]
 * @param  {function} [fail]
 * @return {undefined}
 */
module.exports = function(data, options, success, fail) {
  var spec       = assign(DEFAULTS, options);
  var actionArgs = prepareArgs(spec);

  // Prepare base64 string
  data = data.replace(/data:image\/png;base64,/, '');
  data = data.replace(/data:image\/gif;base64,/, '');
  // And add it to the Service's Action arguments
  actionArgs.unshift(data);

  return exec(ok(success), error(fail), SERVICE, ACTION, actionArgs);
};

/**
 * Gets success callback if it is defined and not null.
 * Otherwise returns a simple console.log.
 * @private
 * @param  {[function|undefined|null]} success
 * @return {function}
 */
function ok(success) {
  if (typeof success !== 'function') {
    return console.log;
  }

  return success;
}

/**
 * Gets fail callback if it is defined and not null.
 * Otherwise returns a simple console.error.
 * @private
 * @param  {[function|undefined|null]} fail
 * @return {function}
 */
function error(fail) {
  if (typeof fail !== 'function') {
    return console.error;
  }

  return fail;
}

/**
 * Gets index of item from array.
 * @private
 * @param  {array}  fromArr - Source array
 * @param  {*}      item    - Item
 * @return {number} Index of item in array
 */
function indexFrom(fromArr, item) {
  return fromArr.indexOf(item);
}

/**
 * Gets value of property with specified key from object.
 * @private
 * @param  {object} fromObj - Source object
 * @param  {string} key     - Property key
 * @return {*}      Property value
 */
function valueFrom(fromObj, key) {
  return fromObj[key];
}

/**
 * Prepares parameter to pass to Service's Action.<br/>
 * Sort options value in order to match "arguments" proto.
 * @private
 * @param  {object} opts - Options object
 * @return {array}  Arguments array
 */
function prepareArgs(opts) {
  var valueFromOpts = valueFrom.bind(null, opts);

  return Object.keys(opts).reduce(function(acc, item) {
    acc.splice(indexFromArgs(item), 0, valueFromOpts(item));

    return acc;
  }, []);
}
