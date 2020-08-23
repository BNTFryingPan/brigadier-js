define([
    "brigadier/errors/CommandErrorType",
    "brigadier/errors/CommandSyntaxError"
    ], function(CommandErrorType, CommandSyntaxError) {
        //console.log("Dynamic4CommandErrorType")
        var Dynamic4CommandErrorType = CommandErrorType.extend({
            init: function(func) {
                this.func = func;
            },
            create: function(a, b, c, d) {
                return new CommandSyntaxError(this, this.func(a, b, c, d))
            },
            /**
             * 
             * @param {ImmutableStringReader} reader 
             * @param {*} a 
             * @param {*} b 
             * @param {*} c
             * @param {*} d
             */
            createWithContext(reader, a, b, c, d) {
                return new CommandSyntaxError(this, this.func(a, b, c, d), reader.getString(), reader.getCursor())
            },
        });
        return Dynamic4CommandErrorType;
    }
);