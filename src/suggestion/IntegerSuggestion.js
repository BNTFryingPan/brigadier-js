define([
    //"brigadier/Message",
    //"brigadier/context/StringRange",
    "brigadier/suggestion/Suggestion"
], function(/*Message, StringRange,*/ Suggestion) {
    var IntegerSuggestion = Suggestion.extend({
        init: function(range, value, tooltip) {
            this.range = range;
            this.value = value;
            this.tooltip = tooltip;
        },
    
        getValue: function() {
            return this.value;
        },
    
        equals: function(o) {
            if (this == o) {
                return true;
            } else if (!(o instanceof IntegerSuggestion)) {
                return false;
            } else {
                return (o.value == this.value && this._super.equals(o))
            }
        },
    
        hashCode: function() {
            return null;
        },
    
        toString: function() {
            return "IntegerSuggestion{" +
                "range=" + this.range +
                ", vaue='" + this.value + '\'' +
                ", tooltip='" + this.tooltip + '\'' +
                '}';
        },
    
        compareTo: function(o) {  // it might be possible to easily implement this on IntegerSuggestion, but to be consistent with Suggestion, i chose to not do it yet
            console.debug("unimplemented")
            return null;
        },
    
        compareToIgnoreCase: function(b) {
            console.debug("unimplemented");
            return null;
        }
    })
    return IntegerSuggestion;
})