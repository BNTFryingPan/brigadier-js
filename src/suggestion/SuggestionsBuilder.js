define([
    "brigadier/suggestion/Suggestions",
    "brigadier/suggestion/Suggestion",
    "brigadier/suggestion/IntegerSuggestion",
    "brigadier/Message",
    "brigadier/context/StringRange"
], function(Suggestions, Suggestion, IntegerSuggestion, Message, StringRange) {
    var SuggestionsBuilder = Class.extend({
        /**
         * 
         * @param {String} input 
         * @param {Number} start 
         */
        init: function(input, start) {
            this.input = input;
            this.start = start;
            this.remaining = input.substring(start)
            /**
             * @type {Suggestion[]}
             */
            this.result = []
        },

        getInput: function() {
            return this.input;
        },

        getStart: function() {
            return this.start;
        },

        getRemaining: function() {
            return this.remaining;
        },

        build: function() {
            Suggestions.create(this.input, this.result);
        },

        /**
         * 
         * @param {String|Number} value 
         * @param {Message} tooltip 
         */
        suggest: function(value, tooltip) {
            tooltip = tooltip || null;
            if (typeof(value) == String) {
                if (value == this.remaining) {
                    return this;
                }
                this.result.push(new Suggestion(StringRange.between(this.start, this.input.length), value, tooltip));
                return this;
            } else if (typeof(value) == Number) {
                this.result.push(new IntegerSuggestion(StringRange.between(this.start, this.input.length), value, tooltip));
            } else {
                throw TypeError("Expected String or Integer, got " + typeof(value));
            }
        },

        add: function(other) {
            if (!typeof(other) == SuggestionsBuilder) {
                throw TypeError("Expected SuggestionsBuilder, got " + typeof(value));
            }
            this.result.concat(other.result)
            return this;
        },

        createOffset: function(start) {
            return new SuggestionsBuilder(this.input, start);
        },

        restart: function() {
            return new SuggestionsBuilder(this.input, this.start)
        }
    })
    return SuggestionsBuilder;
})