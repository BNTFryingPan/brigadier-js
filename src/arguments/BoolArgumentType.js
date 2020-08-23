define([
    "brigadier/StringReader",
    "brigadier/context/CommandContext",
    //"brigadier/error/CommandSyntaxError",
    //"brigadier/suggestion/Suggestions",
    "brigadier/suggestion/SuggestionsBuilder",
    "brigadier/arguments/ArgumentType"
], function(StringReader, CommandContext, /*CommandSyntaxError, Suggestions,*/ SuggestionsBuilder, ArgumentType) {
    //console.log("BoolArgumentType")
    var BoolArgumentType = ArgumentType.extend({
        EXAMPLES: ["true", "false"],

        init: function() {},

        bool: function() {
            return new BoolArgumentType();
        },

        /**
         * 
         * @param {CommandContext} context 
         * @param {String} name 
         */
        getBool: function(context, name) {
            return context.getArgument(name)
        },

        /**
         * 
         * @param {StringReader} reader 
         */
        parse: function(reader) {
            return reader.readBoolean();
        },

        /**
         * 
         * @param {CommandContext} context 
         * @param {SuggestionsBuilder} builder 
         */ 
        listSuggestions: function(context, builder) {
            if ("true".startsWith(builder.getRemaining().toLowerCase())) {
                builder.suggest("true");
            } else if ("false".startsWith(builder.getRemaining().toLowerCase())) {
                builder.suggest("false");
            }
            return builder.build();
        },

        getExamples: function() {
            return this.EXAMPLES;
        }
    })
    return BoolArgumentType;
})