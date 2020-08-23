define([
    //"brigadier/Command",
    //"brigadier/CommandDispatcher",
    //"brigadier/RedirectModifier",
    "brigadier/tree/CommandNode",
    "brigadier/context/SuggestionContext",
    "brigadier/context/ParsedArgument",
    "brigadier/context/ParsedCommandNode",
    "brigadier/context/StringRange"
], function(/*Command, CommandDispatcher, RedirectModifier,*/ CommandNode, SuggestionContext, ParsedArgument, ParsedCommandNode, StringRange) {
    //console.log("CommandContextBuilder")
    var CommandContextBuilder = Class.extend({
        init: function(dispatcher, source, rootNode, start) {
            this.rootNode = rootNode;
            this.dispatcher = dispatcher;
            this.source = source;
            this.range = new StringRange(start, start);
    
            this.arguments = {};
            this.nodes = [];
            this.command = null;
            this.child = null;
            this.modifier = null;
            this.forks = null;
        },
    
        withSource: function(source) {
            this.source = source;
            return this;
        },
    
        getSource: function() {
            return this.source;
        },
    
        getRootNode: function() {
            return this.rootNode;
        },
    
        withArgument: function(name, argument) {
            if (argument instanceof ParsedArgument) {
                this.arguments[name] = argument;
                return this;
            }
            throw TypeError();
        },
    
        getArguments: function() {
            return this.arguments;
        },
    
        withCommand: function(command) {
            this.command = command;
            return this;
        },
    
        /**
         * 
         * @param {CommandNode} node 
         * @param {StringRange} range 
         */
        withNode: function(node, range) {
            if ((node instanceof CommandNode) && (range instanceof StringRange)) {
                this.nodes.push(new ParsedCommandNode(node, range));
                this.range = StringRange.encompassing(this.range, range);
                this.modifier = node.getRedirectModifier();
                this.forks = node.isFork();
                return this;
            }
            throw TypeError();
        },
    
        copy: function() {
            let copy = new CommandContextBuilder(this.dispatcher, this.source, this.rootNode, this.range.getStart());
            copy.command = this.command;
            copy.arguments = this.arguments;
            copy.nodes = this.nodes;
            copy.child = this.child;
            copy.range = this.range;
            copy.forks = this.forks;
            return copy; // this may not be a deep copy, which is what i think the original code is doing.
            // this may or may not cause problems later, however i couldnt find an easy way to make a deep clone that works in this scenario.
            // the most common deep clone method i saw was json.parse(json.stringify(object)), which sadly only works with primitive types
        },
    
        /**
         * 
         * @param {CommandContextBuilder} child 
         */
        withChild: function(child) {
            if (child instanceof CommandContextBuilder) {
                this.child = child;
                return this;
            }
            throw TypeError();
        },
    
        getChild: function() {
            return this.child;
        },
    
        getLastChild: function() {
            let res = this;
            while (res.getChild()) {
                res = res.getChild()
            }
            return res;
        },
    
        getCommand: function() {
            return this.command;
        },
    
        getNodes: function() {
            return this.nodes;
        },
    
        /**
         * 
         * @param {String} input 
         */
        build: function(input) {
            if (typeof(input) == "string") {
                return new CommandContextBuilder(this.source, input, this.arguments, this.command, this.rootNode, this.nodes, this.range, this.child == null ? null : this.child.build(input), this.modifier, this.forks)
            }
            throw TypeError()
        },
    
        getDispatcher: function() {
            return this.dispatcher;
        },
    
        getRange: function() {
            return this.range;
        },
    
        findSuggestionContext: function(cursor) {
            if (Number.isInteger(cursor)) {
                if (this.range.getStart() <= cursor) {
                    if (this.range.getEnd() < cursor) {
                        if (this.child) {
                            return this.child.findSuggestionContext(cursor);
                        } else if (this.nodes != []) {
                            let last = this.nodes[this.nodes.length-1];
                            return new SuggestionContext(last.getNode(), last.getRange().getEnd() + 1);
                        } else {
                            return new SuggestionContext(this.rootNode, this.range.getStart());
                        }
                    } else {
                        let prev = this.rootNode;
                        let nodeRange = null;
                        for (let node in this.nodes) {
                            nodeRange = node.getRange();
                            if (nodeRange.getStart() <= cursor && cursor <= nodeRange.getEnd()) {
                                return new SuggestionContext(prev, nodeRange.getStart());
                            }
                            prev = node.getNode();
                        }
                        if (!prev) throw ReferenceError("Can't find node before cursor");
                        return new SuggestionContext(prev, this.range.getStart());
                    }
                } else throw ReferenceError("Can't find node before cursor");
            } else throw TypeError()
        }
    })
    return CommandContextBuilder;
})