define([
    "brigadier/context/StringRange",
    //"brigadier/suggestion/Suggestion",
], function(StringRange, /*Suggestion*/) {
    var Suggestions = Class.extend({
        init: function(range, suggestions) {
            this.range = range;
            this.suggestions = suggestions;

            this.EMPTY = new Suggestions(new StringRange(0, 0), [])
        },

        getRange: function() {
            return this.range;
        },

        getList: function() {
            return this.suggestions;
        },

        isEmpty: function() {
            return this.suggestions == [];
        },

        equals: function(o) {
            if (this == o) {
                return true;
            } else if (!(o instanceof Suggestions)) {
                return false;
            } else {
                return (o.range == this.range && o.suggestions == this.suggestions)
            }
        },

        hashCode: function() {
            return null;
        },

        toString: function() {
            return "Suggestions{range=" + this.range + ", suggestions=" + this.suggestions + "}"
        },

        empty: function() {
            return new Suggestions(new StringRange.at(0), []);
        },

        merge: function(command, input) {
            if (input == []) {
                return this.empty();
            } else if (input.length == 1) {
                return input[0]
            } else {
                let combinedSuggestions = [];
                input.forEach(elementa => {
                    elementa.getList().forEach(elementb => {
                        combinedSuggestions.push(elementb);
                    })
                });
                return this.create(command, combinedSuggestions);
            }
        },

        create: function(command, suggestions) {
            if (suggestions == []) {
                return this.empty();
            }
            let start = Infinity;
            let end = -Infinity;
            for (let suggestion in suggestions) {
                start = Math.min(suggestion.getRange().getStart(), start);
                end = Math.max(suggestion.getRange().getEnd(), end);
            }

            let range = new StringRange(start, end);
            let texts = [];
            for (let suggestion in suggestions) {
                texts.push(suggestion.expand(command, range));
            }
            texts.sort(); // TODO: make this use the (currently unimplemented) compareToIgnoreCase on Suggestion
            return new Suggestions(range, sorted)
        }
    })
    return Suggestions
})