define([
    //"brigadier/arguments/ArgumentType",
    //"brigadier/suggestion/SuggestionProvider",
    "brigadier/tree/ArgumentCommandNode",
    //"brigadier/tree/CommandNode",
    "brigadier/builder/ArgumentBuilder"
], function(/*ArgumentType, SuggestionProvider,*/ ArgumentCommandNode, /*CommandNode,*/ ArgumentBuilder) {
    //console.log("RAB: " + ArgumentBuilder)
    var RequiredArgumentBuilder = ArgumentBuilder.extend({
        init: function(name, type) {
            this.name = name;
            this.type = type;
            this.suggestionsProvider = null;
        },
    
        /**
         * 
         * @param {*} name 
         * @param {*} type
         * @returns {RequiredArgumentBuilder}
         */
        argument: function(name, type) {
            return new RequiredArgumentBuilder(name, type);
        },
    
        suggests: function(provider) {
            this.suggestionsProvider = provider;
            return this.getThis();
        },
    
        getSuggestionsProvider: function() {
            return this.suggestionsProvider;
        },
    
        getThis: function() {
            return this;
        },
    
        getType: function() {
            return this.type;
        },
    
        getName: function() {
            return this.name;
        },
    
        build: function() {
            let result = new ArgumentCommandNode(this.getName(), getType(), this.getCommand(), this.getRequirement(), this.getRedirect(), this.getRedirectModifier(), this.isFork(), this.getSuggestionsProvider())
        
            for (let arg in this.getArguments()) {
                result.addChild(arg);
            }
    
            return result;
        }
    })
    return RequiredArgumentBuilder;
})