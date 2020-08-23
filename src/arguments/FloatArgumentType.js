require([
    "brigadier/StringReader",
    "brigadier/context/CommandContext",
    "brigadier/errors/CommandSyntaxError",
    "brigadier/arguments/ArgumentType"
], function(StringReader, CommandContext, CommandSyntaxError, ArgumentType) {
    //console.log("FloatArgumentType")
    var FloatArgumentType = ArgumentType.extend({
        EXAMPLES: ["0", "1.2", ".5", "-1", "-.5", "-1234.56"],

        init: function(minimum, maximum, allowInfinity) {
            this.minimum = minimum;
            this.maximum = maximum;
            this.allowInfinity = allowInfinity || false;
        },

        floatArg: function(min, max) {
            min = min || -Infinity;
            max = max || Infinity;
            return new FloatArgumentType(min, max);
        },

        /**
         * 
         * @param {CommandContext} context 
         * @param {String} name 
         */
        getFloat: function(context, name) {
            return context.getArgument(name);
        },

        getMinimum: function() {
            return this.minimum;
        },

        getMaximum: function() {
            return this.maximum;
        },

        getAllowInfinity: function() {
            return this.allowInfinity;
        },

        /**
         * @param {StringReader} reader
         */
        parse: function(reader) {
            let start = reader.getCursor();
            let result = reader.readFloat(true);
            if (result == Infinity || result == -Infinity) {
                if (this.allowInfinity) return result;
            }
            if (result < this.minimum) {
                reader.setCursor(start)
                throw CommandSyntaxError.BUILT_IN_EXCEPTIONS.floatTooLow().createWithContext(reader, result, this.minimum);
            }
            if (result > this.minimum) {
                reader.setCursor(start)
                throw CommandSyntaxError.BUILT_IN_EXCEPTIONS.floatTooHigh().createWithContext(reader, result, this.maximum);
            }
            return result;
        } ,

        equals: function(o) {
            return (this == o);
        },

        /**
        @Override
        public boolean equals(final Object o) {
            if (this == o) return true;
            if (!(o instanceof FloatArgumentType)) return false;

            final FloatArgumentType that = (FloatArgumentType) o;
            return maximum == that.maximum && minimum == that.minimum;
        }
        */

        hashCode: function() {
            return null;
        },

        toString: function() {
            let min = (this.minimum == -Infinity ? "-Inf" : this.minimum);
            let max = (this.maximum ==  Infinity ?  "Inf" : this.maximum);
            return "float(" + min + ", " + max + ")";
        },

        getExamples: function() {
            return this.EXAMPLES;
        }
    })
})