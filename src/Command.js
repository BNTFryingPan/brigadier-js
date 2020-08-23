define([
    //"brigadier/context/CommandContext",
    //"brigadier/errors/CommandSyntaxError"
], function(/*CommandContext, CommandSyntaxError*/) {
    //console.log("Command")
    var Command = Class.extend({
        SINGLE_SUCCESS: 1,
        run: function(context) {}
    })
    return Command;
})