/*
this file contains functions not in the original implementation, but are used by this implementation to recreate the original
*/

var common = {};

common.clone = function(obj) {
    let argsStart;
    let deepClone;
    let args;

    if (typeof deep === 'boolean') {
        argsStart = 2;
        deepClone = deep;
    } else {
        argsStart = 1;
        deepClone = true;
    }

    for (var i = argsStart; i < arguments.length; i++) {
        var source = arguments[i];
        
        if (source) {
            for (var prop in source) {
                if (deepClone && source[prop] && source[prop].constructor === Object) {
                    if (!obj[prop] || obj[prop].constructor === Object) {
                        obj[prop] = obj[prop] || {};
                        this.clone(obj[prop], deepClone, source[prop]);
                    } else {
                        obj[prop] = source[prop];
                    }
                } else {
                    obj[prop] = source[prop];
                }
            }
        }
    }
    
    return obj;
}