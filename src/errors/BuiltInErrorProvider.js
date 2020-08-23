define(function() {
    //console.log("BuiltInErrorProvider")
    var BuiltInErrorProvider = Class.extend({
        doubleTooLow: function() {},
        doubleTooHigh: function() {},
        floatTooLow: function() {},
        floatTooHigh: function() {},
        integerTooLow: function() {},
        integerTooHigh: function() {},
        longTooLow: function() {},
        longTooHigh: function() {},
        literalIncorrect: function() {},
        readerExpectedStartOfQuote: function() {},
        readerExpectedEndOfQuote: function() {},
        readerInvalidEscape: function() {},
        readerInvalidBool: function() {},
        readerInvalidInt: function() {},
        readerExpectedInt: function() {},
        readerInvalidLong: function() {},
        readerExpectedLong: function() {},
        readerInvalidDouble: function() {},
        readerExpectedDouble: function() {},
        readerInvalidFloat: function() {},
        readerExpectedFloat: function() {},
        readerExpectedBool: function() {},
        readerExpectedSymbol: function() {},
        dispatcherUnknownCommand: function() {},
        dispatcherUnknownArgument: function() {},
        dispatcherExpectedArgumentSeparator: function() {},
        dispatcherParseError: function() {},
    });
    return BuiltInErrorProvider;
})

