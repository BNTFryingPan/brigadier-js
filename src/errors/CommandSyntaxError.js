require([
    "brigadier/Message",
    "brigadier/errors/BuiltInErrors"
], function(Message, BuiltInErrors) {
    //console.log("CommandSyntaxError")
    return class CommandSyntaxError extends Error { // in original implementation, exceptions are WhateverException, but to be consistent with JS these are called WhateverError    
        /**
         * 
         * @param {CommandErrorType} type 
         * @param {Message} message 
         * @param {String} input 
         * @param {Number} cursor 
         */
        constructor(type, message, input, cursor) {
            //original line: super(message.getString(), null, ENABLE_COMMAND_STACK_TRACES, ENABLE_COMMAND_STACK_TRACES);
            super(message.getString())
            this.type = type;
            this.message = message;
            this.input = input || null;
            this.cursor = cursor || -1;
    
            this.CONTEXT_AMOUNT = 10;
            this.ENABLE_COMMAND_STACK_TRACES = true;
            this.BUILT_IN_ERRORS = new BuiltInErrors();
        }

        getMessage() {
            let msg = this.message.getString();
            let ctx = this.getContext();
            if (ctx) {
                msg += " at position " + this.cursor + ": " + ctx;
            }
            return msg;
        }
    
        getRawMessage() {
            return this.message;
        }
        
        getContext() {
            if (this.input == null || this.cursor < 0) {
                return null;
            }
    
            // in Java, strings are strange, and you have to use a string builder, but in js, you can just add to it.
            // i named this var builder simply to be consistent with var names of the original code
            let builder = ""; 
            let cur = Math.min(this.input.length, this.cursor);
    
            if (cur > this.CONTEXT_AMOUNT) {
                builder += "...";
            }
    
            builder += this.input.substring(Math.max(0, cur - this.CONTEXT_AMOUNT), cur);
            builder += "<--[HERE]";
    
            return builder;
        }
    
        getType() {
            return this.type;
        }
    
        getInput() {
            return this.input;
        }
    
        getCursor() {
            return this.cursor;
        }
    }
})