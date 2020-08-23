define([], function(){
    var SuggestionContext = Class.extend({
        /**
         * 
         * @param {CommandNode} parent 
         * @param {Number} startPos 
         */
        init: function(parent, startPos) {
            this.parent = parent;
            this.startPos = startPos;
        }
    })
    return SuggestionContext;
})