define([
    "brigadier/StringReader",
    "brigadier/context/CommandContext",
    //"brigadier/errors/CommandSyntaxError",
    //"brigadier/suggestion/Suggestions",
    "brigadier/suggestion/SuggestionsBuilder"
], function(StringReader, CommandContext, /*CommandSyntaxError, Suggestions,*/ SuggestionsBuilder) {
    //console.log("ArgumentType")
    var ArgumentType = Class.extend({
        /**
         * 
         * @param {StringReader} reader 
         */
        parse: function(reader) {},

        /**
         * 
         * @param {CommandContext} context 
         * @param {SuggestionsBuilder} builder 
         */
        listSuggestions: function(context, builder) {
            return [];
        },

        getExamples: function() {
            return [];
        }
    })
    return ArgumentType;
})