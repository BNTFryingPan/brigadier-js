define([
    "brigadier/AmbiguityConsumer",
    "brigadier/Command",
    "brigadier/RedirectModifier",
    "brigadier/StringReader",
    //"brigadier/builder/ArgumentBuilder",
    "brigadier/context/CommandContext",
    //"brigadier/context/CommandContextBuilder",
    //"brigadier/errors/CommandSyntaxError",
    //"brigadier/suggestion/Suggestions",
    "brigadier/suggestion/SuggestionsBuilder",
    //"brigadier/tree/RootCommandNode",
    //"brigadier/tree/LiteralCommandNode",
], function(AmbiguityConsumer, Command, RedirectModifier, StringReader, /*ArgumentBuilder,*/ CommandContext, /*CommandContextBuilder, CommandSyntaxError, Suggestions,*/ SuggestionsBuilder) {
    //console.log("CommandNode")
    var CommandNode = Class.extend({
        /**
         * 
         * @param {Command} command 
         * @param {Function} requirement 
         * @param {CommandNode} redirect 
         * @param {RedirectModifier} modifier 
         * @param {Boolean} forks 
         */
        init: function(command, requirement, redirect, modifier, forks) { // in the original implementation, requirement is a `Predicate` object, which i dont completley understand, but it appears to have some form of function
            this.children = {};
            this.literals = {};
            this.arguments = {};

            this.command = command;
            this.requirement = requirement;
            this.redirect = redirect;
            this.modifier = modifier;
            this.forks = forks;
            this.isCommandNode = true;
            this.nodeType = "CommandNode";
        },

        getCommand: function() {
            return this.command;
        },

        /**
         * @returns {CommandNode[]}
         */
        getChildren: function() {
            return Object.values(this.children);
        },

        getChild: function(name) {
            return this.children[name]
        },

        getRedirect: function() {
            return this.redirect;
        },

        getRedirectModifier: function() {
            return this.modifier;
        },

        canUse: function(source) {
            try {
                return this.requirement(source)
            } catch (err) {
                return true;
            }
            
        },

        /**
         * 
         * @param {CommandNode} node 
         */
        addChild: function(node) {
            //console.log("icn: " + JSON.stringify(node))
            if (!(node.isCommandNode)) {
                throw TypeError("Expected CommandNode, got " + typeof(node))
            } else if (node.nodeType == "RootCommandNode") {
                throw TypeError("Cannot add RootCommandNode as a child to any other CommandNode")
            } else {
                child = this.children[node.getName()]
                if (child) {
                    if (node.getCommand) {
                        child.commmand = node.getCommand();
                    }

                    for (let grandchild in node.getChildren()) {
                        child.addChile(grandchild);
                    }
                } else {
                    this.children[node.getName()] = node;
                    if (node.nodeType == "LiteralCommandNode") {
                        this.literals[node.getName()] = node;
                    } else if (node.nodeType == "ArgumentCommandNode") {
                        this.arguments[node.getName()] = node;
                    }
                }
                // not sure what this line in the original code does, so im going to leave it here commented for future refrence if needed
                // children = children.entrySet().stream().sorted(Map.Entry.comparingByValue()).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
            }
        },

        /**
         * 
         * @param {AmbiguityConsumer} consumer 
         */
        findAmbiguities: function(consumer) {
            if (!(consumer instanceof AmbiguityConsumer)) {
                throw TypeError("Expected AmbiguityConsumer, got " + typeof(consumer))
            }

            let matches = []

            for (let child in Object.values(this.children)) {
                for (let sibling in Object.values(this.children)) {
                    if (child == sibling) {
                        continue;
                    }

                    for (let input in child.getExamples()) {
                        if (sibling.isValidInput(input)) {
                            matches.push(input);
                        }
                    }

                    if (matches.length > 0) {
                        consumer.ambiguious(this, child, sibling, matches);
                        matches = []
                    }
                }

                child.findAmbiguities(consumer)
            }
        },

        isValidInput: function(input) {},

        equals: function(o) {
            if (this == o) return true;
            if (!(o instanceof CommandNode)) return false;
            //if (!this.children == o.children) return false;
            return false;
            
            /*
            original implementation
            
            if (this == o) return true;
            if (!(o instanceof CommandNode)) return false;

            final CommandNode<S> that = (CommandNode<S>) o;

            if (!children.equals(that.children)) return false;
            if (command != null ? !command.equals(that.command) : that.command != null) return false;

            return true;
            */
        },

        hashCode: function() {
            return null;
        },

        getRequirement: function() {
            return this.requirement;
        },

        getName: function() {},

        getUsageText: function() {},

        /**
         * 
         * @param {StringReader} reader 
         * @param {} contextBuilder 
         */
        parse: function(reader, contextBuilder) {},

        /**
         * 
         * @param {CommandContext} context 
         * @param {SuggestionsBuilder} builder 
         */
        listSuggestions: function(context, builder) {},

        createBuilder: function() {},

        getSortedKey: function() {},

        /**
         * 
         * @param {StringReader} input 
         */
        getRelevantNodes: function(input) {
            if (!(input instanceof StringReader)) throw TypeError();

            if (this.literals.length > 0) {
                let cursor = input.getCursor();
                while (input.canRead() && input.peek() != ' ') {
                    input.skip();
                }
                let text = input.getString().substring(cursor, input.getCursor());
                input.setCursor(cursor);
                let literal = this.literals[text];
                if (literal) {
                    return literal;
                } else {
                    return Object.values(this.arguments);
                }
            } else {
                return Object.values(this.arguments);
            }
        },

        compareTo: function(o) {
            if (this.nodeType == o.nodeType) {
                return this.getSortedKey().compareTo(o.getSortedKey());
            }

            return (o.nodeType == "LiteralCommandNode") ? 1 : -1;
        },

        isFork: function() {
            return this.forks;
        },

        getExamples: function() {}
    })
    return CommandNode;
})

