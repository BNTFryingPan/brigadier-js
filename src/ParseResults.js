define([
    "brigadier/StringReader",
], function(StringReader) {
    //console.log("ParseResults")
    var ParseResults = Class.extend({
        /**
         * 
         * @param {CommandContextBuilder} context 
         * @param {StringReader} reader 
         * @param {Object} errors 
         */
        init: function(context, reader, errors) {
            this.context = context;
            this.reader = reader || new StringReader("");
            this.errors = errors || [];
        },

        getContext: function() {
            return this.context;
        },

        getReader: function() {
            return this.reader;
        },

        getErrors: function() {
            return this.errors;
        }
    })
    return ParseResults;
})