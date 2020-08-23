define([
    "brigadier/errors/CommandSyntaxError",
    "brigadier/ImmutableStringReader",
], function(CommandSyntaxError, ImmutableStringReader){
    var SimpleCommandErrorType = Class.extend({
        init: function(message) {
            this.message = message;
        },
    
        create: function() {
            return new CommandSyntaxError(this, this.message);
        },
    
        createWithContext: function(reader) {
            if (!(reader instanceof ImmutableStringReader)) throw TypeError();
            return new CommandSyntaxError(this, this.message, reader.getString(), reader.getCursor());
        },
    
        toString: function() {
            return this.message.getString();
        }
    })
    return SimpleCommandErrorType;
})