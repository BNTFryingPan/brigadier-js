define([
    "brigadier/errors/CommandErrorType",
    "brigadier/errors/CommandSyntaxError"
], function(CommandErrorType, CommandSyntaxError) {
    //console.log("Dynamic2CommandErrorType")
    var Dynamic2CommandErrorType = CommandErrorType.extend({
        init: function(func) {
            this.func = func;
        },
        create: function(a, b) {
            return new CommandSyntaxError(this, this.func(a, b))
        },
        /**
         * 
         * @param {ImmutableStringReader} reader 
         * @param {*} a 
         * @param {*} b 
         */
        createWithContext(reader, a, b) {
            return new CommandSyntaxError(this, this.func(a, b), reader.getString(), reader.getCursor())
        },
    });
    return Dynamic2CommandErrorType;
})