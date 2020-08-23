define(
    [
        "brigadier/builder/ArgumentBuilder",
        //"brigadier/tree/CommandNode",
        "brigadier/tree/LiteralCommandNode"
    ], function(ArgumentBuilder, /*CommandNode,*/ LiteralCommandNode) {
        //console.log("LiteralArgumentBuilder")
        //console.log(ArgumentBuilder)
        //debugger
        var LiteralArgumentBuilder = ArgumentBuilder.extend({
            init: function(literal) {
                this._super();
                this.literal = literal;
                
            },
        
            newliteral: function(name) {
                return new LiteralArgumentBuilder(name)
            },
        
            getThis: function() {
                return this;
            },
        
            getLiteral: function() {
                return this.literal;
            },
        
            build: function() {
                let result = new LiteralCommandNode(this.getLiteral(), this.getCommand(), this.getRequirement(), this.getRedirect(), this.getRedirectModifier(), this.isFork());
        
                //console.log("getargs: " + JSON.stringify(this.getArguments()))
                for (let argument in this.getArguments()) {
                    result.addChild(this.getArguments()[argument]);
                }
        
                return result;
            }
        });
        return LiteralArgumentBuilder;
    }
);