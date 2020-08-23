define([
    "brigadier/arguments/ArgumentType",
    "brigadier/StringReader"
], function(ArgumentType, StringReader) {
    var StringArgumentType = ArgumentType.extend({

    })
    return StringArgumentType;
})

class StringArgumentType {
    constructor(type) {
        this.type = type;
    }

    word() {
        return new StringArgumentType(StringType.SINGLE_WORD);
    }

    string() {
        return new StringArgumentType(StringType.QUOTABLE_PHRASE);
    }

    greedyString() {
        return new StringArgumentType(StringType.GREEDY_PHRASE);
    }

    getString(context, name) {
        return context.getArgument(name);
    }

    getType() {
        return this.type;
    }

    /**
     * 
     * @param {StringReader} reader 
     */
    parse(reader) {
        if (this.type == StringType.GREEDY_PHRASE) {
            let text = reader.getRemaining();
            reader.setCursor(reader.getTotalLength());
            return text;
        } else if (this.type == StringType.SINGLE_WORD) {
            return reader.readUnquotedString();
        } else {
            return reader.readString();
        }
    }

    toString() {
        return "string()";
    }

    getExamples() {
        return this.type.getExamples();
    }

    /**
     * 
     * @param {String} input 
     */
    escapeIfRequired(input) {
        for (let c in input.split("")) {
            if (!StringReader.isAllowedInUnquotedString(c)) {
                return this.escape(input)
            }
        }
        return input;
    }

    escape(input) {
        let result = "\"";

        for (let i = 0; i < input.length; i++) {
            let c = input[i];
            if (c == "\\" || '"') {
                result += "\\";
            }
            result += c;
        }

        result += '"';
        return result;
    }
}

class StringType {
    static SINGLE_WORD = new StringType(["word", "words_with_underscores"]);
    static QUOTABLE_PHRASE = new StringType(["word", '"quoted phrase"', '""']);
    static GREEDY_PHRASE = new StringType(["word", "words with spaces", '"and symbols"']);

    constructor(examples) {
        this.examples = examples;
    }

    getExamples() {
        return this.examples
    }
}