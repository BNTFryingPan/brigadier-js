define([
    //"brigadier/Command",
    //"brigadier/RedirectModifier",
    //"brigadier/SingleRedirectModifier",
    "brigadier/tree/CommandNode",
    "brigadier/tree/RootCommandNode"
], function(/*Command, RedirectModifier, SingleRedirectModifier,*/ CommandNode, RootCommandNode) {
    //console.log("ArgumentBuilder")
    var ArgumentBuilder = Class.extend({
        init: function() {
            this.arguments = new RootCommandNode();
            this.command = null;
            this.requirement = true;
            this.target = null;
            this.modifier = null;
            this.forks = null;
        },
        getThis: function() {},
        /**
         * 
         * @param {ArgumentBuilder|CommandNode} argument 
         */
        then: function(argument) {
            if (argument instanceof ArgumentBuilder) {
                if (this.target) {
                    throw ReferenceError("Cannot add children to a redirected node");
                }
                this.arguments.addChild(argument.build());
                return this.getThis();
            } else if (argument instanceof CommandNode) {
                if (this.target) {
                    throw ReferenceError("Cannot add children to a redirected node");
                }
                this.arguments.addChild(argument);
                return this.getThis();
            }
        },
        getArguments: function() {
            return this.arguments.getChildren();
        },
        executes: function(command) {
            this.command = command;
            return this.getThis();
        },
        getCommand: function() {
            return this.command;
        },
        requires: function(requirement) {
            this.requirement = requirement;
            return this.getThis();
        },
        getRequirement: function() {
            return this.requirement;
        },
        redirect: function(target, modifier) {
            if (!modifier) {
                return this.forward(target, null, false);
            } else {
                return this.forward(target, o => modifier.apply(o), false);
            }
        },
        fork: function(target, modifier) {
            return this.forward(target, modifier, true)
        },
        forward: function(target, modifier, fork) {
            if (!this.arguments.getChildren().length == 0) {
                console.log(this.arguments.getChildren())
                throw ReferenceError("Cannot forward a node with children");
            }
            this.target = target;
            this.modifier = modifier;
            this.forks = fork;
            return this.getThis();
        },
        getRedirect: function() {
            return this.target;
        },
        getRedirectModifier: function() {
            return this.modifier;
        },
        isFork: function() {
            return this.forks;
        },
        build: function() {}
    })
    return ArgumentBuilder;
})