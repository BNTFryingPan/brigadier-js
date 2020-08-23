define([
    "brigadier/Command",
    //"brigadier/RedirectModifier",
    "brigadier/StringReader",
    "brigadier/arguments/ArgumentType",
    "brigadier/builder/RequiredArgumentBuilder",
    //"brigadier/context/CommandContext",
    "brigadier/context/CommandContextBuilder",
    "brigadier/context/ParsedArgument",
    "brigadier/errors/CommandSyntaxError",
    "brigadier/suggestion/SuggestionProvider",
    //"brigadier/suggestion/Suggestions",
    //"brigadier/suggestion/SuggestionsBuilder",
], function(Command, /*RedirectModifier,*/ StringReader, ArgumentType, RequiredArgumentBuilder, /*CommandContext,*/ CommandContextBuilder, ParsedArgument, CommandSyntaxError, SuggestionProvider, /*Suggestions, SuggestionsBuilder*/) {
    var ArgumentCommandNode = CommandNode.extend({
        /**
         * 
         * @param {String} name 
         * @param {ArgumentType} type 
         * @param {Command} command 
         * @param {Function} requirement 
         * @param {CommandNode} redirect 
         * @param {redirectModifier} modifier 
         * @param {Boolean} forks 
         * @param {SuggestionProvider} customSuggestions 
         */
        init: function(name, type, command, requirement, redirect, modifier, forks, customSuggestions) {
            super(command, requirement, redirect, modifier, forks);
            this.name = name;
            this.type = type;
            this.customSuggestions = customSuggestions;

            this.USAGE_ARGUMENT_OPEN = "<";
            this.USAGE_ARGUMENT_CLOSE = ">";

            this.isCommandNode = true;
            this.nodeType = "ArgumentCommandNode";
        },

        getType: function() {
            return this.type;
        },

        getName: function() {
            return this.name;
        },

        getUsageText: function() {
            return this.USAGE_ARGUMENT_OPEN + this.name + this.USAGE_ARGUMENT_CLOSE;
        },

        getCustomSuggestions: function() {
            return this.customSuggestions;
        },

        /**
         * 
         * @param {StringReader} reader 
         * @param {CommandContextBuilder} contextBuilder 
         */
        parse: function(reader, contextBuilder) {
            let start = reader.getCursor();
            let result = this.type.parse(reader);
            let parsed = new ParsedArgument(start, reader.getCursor(), result);

            contextBuilder.withArgument(name, parsed);
            contextBuilder.withNode(this, parsed.getRange());
        },

        listSuggestions: function(context, builder) {
            if (this.customSuggestions) return this.customSuggestions.getSuggestions(context, builder);
            return this.type.listSuggestions(context, builder)
        },

        createBuilder: function() {
            let builder = new RequiredArgumentBuilder(name, type);
            builder.requires(this.getRequirement());
            builder.forward(this.getRedirect(), this.getRedirectModifier(), this.isFork());
            builder.suggests(this.customSuggestions);
            if (this.getCommand()) {
                builder.executes(this.getCommand());
            }
            return builder;
        },

        isValidInput: function(input) {
            try {
                let reader = new StringReader(input);
                this.type.parse(reader);
                return !reader.canRead() || reader.peek() == ' ';
            } catch (err) {
                if (err instanceof CommandSyntaxError) {
                    return false;
                } else throw err;
            }
        },

        equals: function(o) {
            return this == o; //i got tired of rewriting these equals functions
        },
        /*
        public boolean equals(final Object o) {
            if (this == o) return true;
            if (!(o instanceof ArgumentCommandNode)) return false;

            final ArgumentCommandNode that = (ArgumentCommandNode) o;

            if (!name.equals(that.name)) return false;
            if (!type.equals(that.type)) return false;
            return super.equals(o);
        } */

        hashCode: function() {
            return null;
        },

        getSortedKey: function() {
            return name;
        },

        getExamples: function() {
            return this.type.getExamples();
        },

        toString: function() {
            return "<argument " + this.name + ":" + this.type + ">"
        },
    })
    return ArgumentCommandNode;
})