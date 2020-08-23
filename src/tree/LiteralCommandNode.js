define([
    "brigadier/Command",
    "brigadier/RedirectModifier",
    "brigadier/StringReader",
    "brigadier/builder/LiteralArgumentBuilder",
    "brigadier/context/CommandContext",
    "brigadier/context/CommandContextBuilder",
    "brigadier/context/StringRange",
    "brigadier/errors/CommandSyntaxError",
    //"brigadier/suggestion/Suggestions",
    "brigadier/suggestion/SuggestionsBuilder",
    "brigadier/tree/CommandNode"
], function(Command, RedirectModifier, StringReader, LiteralArgumentBuilder, CommandContext, CommandContextBuilder, StringRange, CommandSyntaxError, /*Suggestions,*/ SuggestionsBuilder, CommandNode) {
    //console.log("LiteralCommandNode")
    var LiteralCommandNode = CommandNode.extend({
        /**
         * 
         * @param {String} literal 
         * @param {Command} command 
         * @param {Function} requirement 
         * @param {CommandNode} redirect 
         * @param {RedirectModifier} modifier 
         * @param {Boolean} forks 
         */
        init: function(literal, command, requirement, redirect, modifier, forks) {
            this._super(command, requirement, redirect, modifier, forks);
            this.literal = literal;
            this.isCommandNode = true;
            this.nodeType = "LiteralCommandNode";
        },

        getLiteral: function() {
            return this.literal;
        },

        getName: function() {
            return this.literal;
        },

        /**
         * 
         * @param {StringReader} reader 
         * @param {CommandContextBuilder} contextBuilder 
         */
        parse: function(reader, contextBuilder) {
            if (!contextBuilder) {
                let start = reader.getCursor();
                if (reader.canRead(this.literal.length)) {
                    let end = start + this.literal.length;
                    if (reader.getString().substring(start, end) == this.literal) {
                        reader.setCursor(end);
                        if (!reader.canRead() || reader.peek() == " ") {
                            return end;
                        } else {
                            reader.setCursor(start);
                        }
                    }
                }

                return -1;
            } else {
                let start = reader.getCursor();
                let end = this.parse(reader);
                if (end > -1) {
                    contextBuilder.withNode(this, StringRange.between(start, end));
                    return;
                }

                throw CommandSyntaxError.BUILT_IN_ERRORS.literalIncorrect().createWithContext(reader, literal);
            }
        },

        /**
         * 
         * @param {CommandContext} context 
         * @param {SuggestionsBuilder} builder 
         */
        listSuggestions: function(context, builder) {
            if (this.literal.toLowerCase().startsWith(builder.getRemaining().toLowerCase())) {
                return builder.suggest(this.literal).build()
            } else {
                return [];
            }
        },

        isValidInput: function(input) {
            return this.parse(new StringReader(input)) > -1;
        },

        equals: function(o) {
            if (o == this) return true;
            if (!(o instanceof LiteralCommandNode)) return false;

            if (o.literal != this.literal) return false;
            return this._super().equals(o);
        },

        getUsageText: function() {
            return this.literal;
        },

        hashCode: function() {
            return null;
        },

        createBuilder: function() {
            let builder = new LiteralArgumentBuilder(this.literal);
            builder.requires(this.getRequirement());
            builder.forward(this.getRedirect(), this.getRedirectModifier(), this.isFork());
            if (this.getCommand()) {
                builder.executes(this.getCommand());
            }
            return builder;
        },

        getSortedKey: function() {
            return this.literal;
        },

        getExamples: function() {
            return [this.literal];
        },

        toString: function() {
            return "<literal " + this.literal + ">"
        }
    })
    return LiteralCommandNode;
})