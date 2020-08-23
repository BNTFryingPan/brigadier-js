define([
    "brigadier/ImmutableStringReader"
], function(ImmutableStringReader) {
    var StringRange = Class.extend({
        init: function(start, end) {
            this.start = start;
            this.end = end;
        },
    
        at: function(pos) {
            return new StringRange(pos, pos)
        },
    
        between: function(start, end) {
            return new StringRange(start, end);
        },
    
        emcompassing: function(a, b) {
            return new StringRange(Math.min(a.getStart(), b.getStart()), Math.max(a.getEnd(), b.getEnd()));
        },
    
        getStart: function() {
            return this.start;
        },
    
        getEnd: function() {
            return this.end;
        },
    
        get: function(arg) {
            if (arg instanceof ImmutableStringReader) {
                return arg.getString().substring(this.start, this.end);
            } else if (typeof(arg) == "string") {
                return string.substring(this.start, this.end);
            }
        },
    
        isEmpty: function() {
            return this.start == this.end
        },
    
        getLength: function() {
            return this.end - this.start
        },
    
        equals: function(o) {
            if (this == o) {
                return true;
            } else if (!(o instanceof StringRange)) {
                return false;
            } else {
                return (o.start == this.start && o.end == this.end)
            }
        },
    
        hashCode: function() {
            return null;
        },
    
        toString: function() {
            return "StringRange{start=" + this.start + ", end=" + this.end + "}"
        },
    })
    return StringRange;
})