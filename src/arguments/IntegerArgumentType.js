class IntegerArgumentType extends ArgumentType {
    EXAMPLES = ["0", "123", "-123"];

    constructor(minimum, maximum, allowInfinity) {
        this.minimum = minimum;
        this.maximum = maximum;
        this.allowInfinity = allowInfinity || false;
    }

    integerArg(min, max) {
        min = min || -Infinity;
        max = max || Infinity;
        return new IntegerArgumentType(min, max);
    }

    /**
     * 
     * @param {CommandContext} context 
     * @param {String} name 
     */
    getInteger(context, name) {
        return context.getArgument(name);
    }

    getMinimum() {
        return this.minimum;
    }

    getMaximum() {
        return this.maximum;
    }

    getAllowInfinity() {
        return this.allowInfinity;
    }

    /**
     * @param {StringReader} reader
     */
    parse(reader) {
        let start = reader.getCursor();
        let result = reader.readInt(true);
        if (result == Infinity || result == -Infinity) {
            if (this.allowInfinity) return result;
        }
        if (result < this.minimum) {
            reader.setCursor(start)
            throw CommandSyntaxError.BUILT_IN_EXCEPTIONS.integerTooLow().createWithContext(reader, result, this.minimum);
        }
        if (result > this.minimum) {
            reader.setCursor(start)
            throw CommandSyntaxError.BUILT_IN_EXCEPTIONS.integerTooHigh().createWithContext(reader, result, this.maximum);
        }
        return result;
    } 

    equals(o) {
        return (this == o);
    }

    /**
    @Override
    public boolean equals(final Object o) {
        if (this == o) return true;
        if (!(o instanceof FloatArgumentType)) return false;

        final FloatArgumentType that = (FloatArgumentType) o;
        return maximum == that.maximum && minimum == that.minimum;
    }
    */

    hashCode() {
        return null;
    }

    toString() {
        let min = (this.minimum == -Infinity ? "-Inf" : this.minimum);
        let max = (this.maximum ==  Infinity ?  "Inf" : this.maximum);
        return "integer(" + min + ", " + max + ")";
    }

    getExamples() {
        return this.EXAMPLES;
    }
}