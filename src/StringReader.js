define([
    "brigadier/errors/CommandSyntaxError",
    "brigadier/ImmutableStringReader"
], function(CommandSyntaxError, ImmutableStringReader) {
    //console.log("StringReader")
    var StringReader = ImmutableStringReader.extend({
        /**
         * 
         * @param {String|StringReader} arg String or StringReader to be used when creating this new StringReader
         */
        init: function(arg) {
            if (typeof arg == "string") {
                this.string = arg;
            } else if (arg instanceof StringReader) {
                this.string = arg.string;
                this.cursor = arg.cursor;
            } else {
                throw TypeError();
            }

            this.SYNTAX_ESCAPE = "\\";
            this.SYNTAX_DOUBLE_QUOTE = '"';
            this.SYNTAX_SINGLE_QUOTE = "'";
        },

        /**
         * @returns {String} The string of this StringReader.
         */
        getString: function() {
            return this.string;
        },

        /**
         * Sets the cursor location of this StringReader.
         * 
         * @param {Number} cursor The cursor location to jump to
         */
        setCursor: function(cursor) {
            if (!(cursor instanceof Number)) throw TypeError();
            this.cursor = cursor;
        },

        getRemainingLength: function() {
            return this.string.length - this.cursor;
        },

        getTotalLength: function() {
            return this.string.length;
        },

        getCursor: function() {
            return this.cursor;
        },

        getRead: function() {
            return this.string.substring(0, this.cursor);
        },

        getRemaining: function() {
            return this.string.substring(this.cursor);
        },

        canRead: function(length) {
            return this.cursor + (length || 1) <= this.string.length;
        },

        peek: function(offset) {
            return this.string.charAt(this.cursor + (offset || 0));
        },

        read: function() {
            return this.string.charAt(this.cursor++);
        },

        skip: function() {
            this.cursor++
        },

        isAllowedNumber: function(c) {
            return (c >= 0 && c <= 9 || c == "." || c == "-");
        },

        isQuotedStringStart: function(c) {
            return (c == this.SYNTAX_DOUBLE_QUOTE || c == this.SYNTAX_SINGLE_QUOTE);
        },

        stringIsWhitespace: function(str) { // not in original implementation, but is used for the following function skipWhitespace()
            return (!str || str.length === 0 || /^\s*$/.test(str))
        },

        skipWhitespace: function() {
            while(this.canRead() && this.stringIsWhitespace(this.peek())) {
                this.skip();
            }
        },

        readInt: function(allowInfinity) {
            allowInfinity = allowInfinity || false;
            let start = this.cursor;

            if (allowInfinity) {
                let test = this.readString().toLowerCase()
                if (test in ["-infinity", "infinity"]) {
                    if (test ==  "infinity") return  Infinity;
                    if (test == "-infinity") return -Infinity;
                } else this.setCursor(start);
            }

            while (this.canRead() && this.isAllowedNumber(this.peek())) {
                this.skip();
            }
            let num = "" + this.string.substring(start, cursor);
            if (num == "") throw CommandSyntaxError.BUILT_IN_ERRORS.readerExpectedInt().createWithContext(this);

            let int = parseInt(num);
            if (isNaN(int)) {
                this.cursor = start;
                throw CommandSyntaxError.BUILT_IN_ERRORS.readerInvalidInt().createWithContext(this, num);
            }
            return int;
        },

        readLong: function() {
            // there is no Long is js, so just do the readInt method instead
            return this.readInt()
        },

        readFloat: function(allowInfinity) { // original implementation doesnt allow infinity or -infinity, but i chose to add it as an option, off by default
            allowInfinity = allowInfinity || false;
            let start = this.cursor;
            
            if (allowInfinity) {
                let test = this.readString().toLowerCase()
                if (test in ["-infinity", "infinity"]) {
                    if (test ==  "infinity") return  Infinity;
                    if (test == "-infinity") return -Infinity;
                } else this.setCursor(start);
            }
            
            while (this.canRead() && this.isAllowedNumber(this.peek())) {
                this.skip();
            }
            let num = "" + this.string.substring(start, cursor);
            if (num == "") throw CommandSyntaxError.BUILT_IN_ERRORS.readerExpectedDouble().createWithContext(this);

            let float = parseFloat(num);
            if (isNaN(float)) {
                this.cursor = start;
                throw CommandSyntaxError.BUILT_IN_ERRORS.readerInvalidDouble().createWithContext(this, num);
            }
            return float
        },

        readDouble: function(allowInfinity) {
            // there is no Double in js, so just do the readFloat method instead
            return this.readFloat(allowInfinity)
        },

        isAllowedInUnquotedString: function(c) {
            return c.test("[A-Za-z0-9_.-+]")
        },

        readUnquotedString: function() {
            let start = this.cursor;
            while (this.canRead() && this.isAllowedInUnquotedString(this.peek())) {
                this.skip();
            }
            return this.string.substring(start, this.cursor);
        },

        readQuotedString: function() {
            if (!this.canRead()) {
                return "";
            }
            let next = this.peek();
            if (!this.isQuotedStringStart(next)) {
                throw CommandSyntaxError.BUILT_IN_ERRORS.readerExpectedStartOfQuote().createWithContext(this);
            }
            this.skip();
            return this.readStringUntil(next);
        },

        readStringUntil: function(terminator) {
            if (!(terminator instanceof String) || !(terminator.length == 1)) throw TypeError("Expected single character string, got " + String(terminator))
            let res = "";
            let escaped = false;
            while (this.canRead()) {
                let c = this.read();
                if (escaped) {
                    if (c == terminator || c == this.SYNTAX_ESCAPE) {
                        res += c;
                        escaped = false;
                    } else {
                        this.setCursor(this.getCursor() - 1);
                        throw CommandSyntaxError.BUILT_IN_ERRORS.readerInvalidEscape().createWithContext(this, String.valueOf(c));
                    }
                } else if (c == this.SYNTAX_ESCAPE) {
                    escaped = true;
                } else if (c == terminator) {
                    return res;
                } else {
                    res += c;
                }
            }

            throw CommandSyntaxError.BUILT_IN_ERRORS.readerExpectedEndOfQuote().createWithContext(this);
        },

        readString: function() {
            if (!this.canRead()) {
                return ""
            }
            let next = peek();
            if (this.isQuotedStringStart(next)) {
                this.skip();
                return this.readStringUntil(next)
            }
            return this.readUnquotedString();
        },

        readBoolean: function(allowInt) { // the original implementation doesnt allow 0 = false; 1 = true. this is just an option to allow it to do that, however it is disabled by default, and not required
            allowInt = allowInt || false;
            let start = this.cursor;
            let value = "" + this.readString();
            if (value == "") {
                throw CommandSyntaxError.BUILT_IN_ERRORS.readerExpectedBool().createWithContext(this);
            }

            if (value.toLowerCase() == "true" || (allowInt && value == "1")) {
                return true;
            } else if (value.toLowerCase() == "false" || (allowInt && value == "0")) {
                return false;
            } else {
                this.cursor = start;
                throw CommandSyntaxError.BUILT_IN_ERRORS.readerInvalidBool().createWithContext(this, value);
            }
        },

        expect: function(c) {
            if (!this.canRead() || this.peek() != c) {
                throw CommandSyntaxError.BUILT_IN_ERRORS.readerExpectedSymbol().createWithContext(this, String.valueOf(c));
            }
            this.skip();
        }
    })
    return StringReader;
})