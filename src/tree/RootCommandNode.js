define([
    //"brigadier/StringReader",
    //"brigadier/builder/ArgumentBuilder",
    //"brigadier/context/CommandContext",
    //"brigadier/context/CommandContextBuilder",
    //"brigadier/errors/CommandSyntaxError",
    "brigadier/suggestion/Suggestions",
    //"brigadier/suggestion/SuggestionsBuilder",
    "brigadier/tree/CommandNode"
], function(/*StringReader, ArgumentBuilder, CommandContext, CommandContextBuilder, CommandSyntaxError,*/ Suggestions, /*SuggestionsBuilder,*/ CommandNode) {
    //console.log("RootCommandNode")
    var RootCommandNode = CommandNode.extend({
        init: function(s) {
            this._super(null, true, null, s, false);
            this.nodeType = "RootCommandNode"
        },
    
        getName: function() {
            return "";
        },
    
        getUsageText: function() {
            return "";
        },
    
        parse: function(reader, contextBuilder) {},
    
        listSuggestions: function(context, builder) {
            return Suggestions.empty()
        },
    
        isValidInput: function(input) {
            return false;
        },
    
        equals: function(o) {
            if (this == o) return true;
            if (!(o instanceof RootCommandNode)) return false;
            return this._super.equals(o)
        },
    
        createBuilder: function() {
            throw TypeError("Cannot convert RootCommandNode into a builder");
        },
    
        getSortedKey: function() {
            return "";
        },
    
        getExamples: function() {
            return [];
        },
    
        toString: function() {
            return "<root>"
        }
    }) 
    return RootCommandNode;
})