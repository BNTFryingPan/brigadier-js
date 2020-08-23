define([
    //"brigadier/Message",
    //"brigadier/context/StringRange"
], function(/*Message, StringRange*/) {
    //console.log("Suggestion")
    var Suggestion = Class.extend({
        init: function(range, text, tooltip) {
            this.range = range;
            this.text = text;
            this.tooltip = tooltip;
        },
    
        getRange: function() {
            return this.range;
        },
    
        getText: function() {
            return this.text;
        },
        
        getTooltip: function() {
            return this.tooltip;
        },
        
        apply: function(input) {
            if (this.range.getStart() == 0 && this.range.getEnd == input.length) {
                return this.text;
            }
            let result = "";
            if (this.range.getStart() > 0) {
                result += input.substring(0, this.range.getEnd())
            }
            result += this.text;
            if (this.range.getEnd() < input.length) {
                result += input.substring(range.getEnd())
            }
            return result;
        },
    
        equals: function(o) {
            if (this == o) {
                return true;
            } else if (!(o instanceof Suggestion)) {
                return false;
            } else {
                return (o.range == this.range && o.text == this.text && o.tooltip == this.tooltip)
            }
        },
    
        hashCode: function() {
            return null;
        },
    
        toString: function() {
            return "Suggestion{" +
                "range=" + this.range +
                ", text='" + this.text + '\'' +
                ", tooltip='" + this.tooltip + '\'' +
                '}';
        },
    
        compareTo: function(o) {
            console.debug("unimplemented")
            return null;
        },
    
        compareToIgnoreCase: function(b) {
            console.debug("unimplemented");
            return null;
        },
    
        expand: function(command, range) {
            if (range == this.range) {
                return this;
            }
    
            let result = "";
            if (range.getStart() < this.range.getStart()) {
                result.append(command.substring(range.getStart(), this.range.getStart()));
            }
            result.append(text);
            if (range.getEnd() > this.range.getEnd()) {
                result.append(command.substring(this.range.getEnd(), range.getEnd()));
            }
            return new Suggestion(range, result, tooltip);
    
        }
    });
    return Suggestion;
})