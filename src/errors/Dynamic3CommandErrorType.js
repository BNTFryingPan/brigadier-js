define([
    "brigadier/errors/CommandErrorType",
    "brigadier/errors/CommandSyntaxError"
    ], function(CommandErrorType, CommandSyntaxError) {
        //console.log("Dynamic3CommandErrorType")
        var Dynamic3CommandErrorType = CommandErrorType.extend({
            init: function(func) {
                this.func = func;
            },
            create: function(a, b, c) {
                return new CommandSyntaxError(this, this.func(a, b, c))
            },
            /**
             * 
             * @param {ImmutableStringReader} reader 
             * @param {*} a 
             * @param {*} b 
             * @param {*} c
             */
            createWithContext(reader, a, b, c) {
                return new CommandSyntaxError(this, this.func(a, b, c), reader.getString(), reader.getCursor())
            },
        });
        return Dynamic3CommandErrorType;
    }
);