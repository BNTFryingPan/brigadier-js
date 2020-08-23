define([
    "brigadier/errors/CommandErrorType",
    "brigadier/errors/CommandSyntaxError"
    ], function(CommandErrorType, CommandSyntaxError) {
        var DynamicNCommandErrorType = CommandErrorType.extend({
            init: function(func) {
                this.func = func;
            },
            create: function(args) {
                return new CommandSyntaxError(this, this.func(args))
            },
            /**
             * 
             * @param {ImmutableStringReader} reader 
             * @param {*} args
             */
            createWithContext(reader, args) {
                return new CommandSyntaxError(this, this.func(args), reader.getString(), reader.getCursor())
            },
        });
        return DynamicNCommandErrorType;
    }
)