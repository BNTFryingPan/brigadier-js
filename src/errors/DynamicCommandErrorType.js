define([
    "brigadier/errors/CommandErrorType",
    "brigadier/errors/CommandSyntaxError"
    ], function(CommandErrorType, CommandSyntaxError) {
        //console.log("DynamicCommandErrorType")
        var DynamicCommandErrorType = CommandErrorType.extend({
            init: function(message) {
                this.message = message;
            },
            create: function() {
                return new CommandSyntaxError(this, this.message)
            },
            /**
             * 
             * @param {ImmutableStringReader} reader 
             */
            createWithContext(reader) {
                return new CommandSyntaxError(this, this.message, reader.getString(), reader.getCursor())
            },
        });
        return DynamicCommandErrorType;
    }
)