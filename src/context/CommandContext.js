require([
    "brigadier/Command",
    "brigadier/RedirectModifier",
    "brigadier/tree/CommandNode"
], function(Command, RedirectModifier, CommandNode) {
    //console.log("CommandContext")
    var CommandContext = Class.extend({
        /**
         * @param {Object} source
         * @param {String} input
         * @param {Object} arguments
         * @param {Command} command
         * @param {CommandNode} rootNode
         * @param {ParsedCommandNode[]} nodes
         * @param {StringRange} range
         * @param {CommandContext} child
         * @param {RedirectModifier} modifier
         * @param {Boolean} forks
         */
        init: function(source, input, args, command, rootNode, nodes, range, child, modifier, forks) {
            this.source = source;
            this.input = input;
            this.arguments = args;
            this.command = command;
            this.rootNode = rootNode;
            this.nodes = nodes;
            this.range = range;
            this.child = child;
            this.modifier = modifier;
            this.forks = forks;
        },

        copyFor: function(source) {
            if (this.source == source) {
                return this;
            }
            return new CommandContext(this.source, this.input, this.arguments, this.command, this.rootNode, this.nodes, this.range, this.child, this.modifier, this.forks)
        },

        getChild: function() {
            return this.child;
        },

        getLastChild: function() {
            let result = this;
            while (result.getChild()) {
                result = result.getChild();
            }
            return result;
        },

        getCommand: function() {
            return this.command;
        },

        getSource: function() {
            return this.source;
        },

        /**
         * 
         * @param {String} name 
         */
        getArgument: function(name) { // the original implementation also takes a class, and casts the return to that class type, i dont think thats needed in the JS implementation
            let arg = this.arguments[name];
            if (!argument) {
                throw ReferenceError("No such argument '" + name + "' exists on this command");
            }
            return arg
        },

        equals: function(o) {
            if (this == o) return true;
            if (!(o instanceof CommandContext)) return false;

            let that = o;
            // this chunk of code may cause errors!
            if (!arguments.equals(that.arguments)) return false;
            if (!rootNode.equals(that.rootNode)) return false;
            if (nodes.size() != that.nodes.size() || !nodes.equals(that.nodes)) return false;
            if (command != null ? !command.equals(that.command) : that.command != null) return false;
            if (!source.equals(that.source)) return false;
            if (child != null ? !child.equals(that.child) : that.child != null) return false;

            return true;
        },

        hashCode: function() {
            return null;
        },

        getRedirectModifier: function() {
            return this.modifier;
        },

        getRange: function() {
            return this.range;
        },

        getInput: function() {
            return this.input;
        },

        getRootNode: function() {
            return this.rootNode;
        },

        getNodes: function() {
            return this.nodes;
        },

        hasNodes: function() {
            return !(this.nodes == []);
        },

        isForked: function() {
            return this.forks;
        }
    });
    return CommandContext;
})