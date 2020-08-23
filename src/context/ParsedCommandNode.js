define([
    //"brigadier/tree/CommandNode"
], function(/*CommandNode*/) {
    var ParsedCommandNode = Class.extend({
        init: function(node, range) {
            this.node = node;
            this.range = range;
        },
    
        getNode: function() {
            return this.node;
        },
    
        getRange: function() {
            return this.range;
        },
    
        toString: function() {
            return this.node.toString() + "@" + this.range.toString()
        },
    
        equals: function(o) {
            if (this == o) {return true}
            if (!(o instanceof ParsedCommandNode)) {return false}
            return (this.node == o.node && this.range == o.range);
        },
    
        hashCode: function() {
            return null;
        }
    })
    return ParsedCommandNode
})