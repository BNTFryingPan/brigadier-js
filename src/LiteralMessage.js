define([
    "brigadier/Message"
], function(Message) {
    var LiteralMessage = Message.extend({
        init: function(str) {
            this.str = str;
        },
        getString: function() {
            return this.str;
        },
        toString: function() {
            return this.str;
        }
    })
    return LiteralMessage;
})