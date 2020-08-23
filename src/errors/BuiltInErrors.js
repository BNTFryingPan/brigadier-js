define([
    "brigadier/errors/BuiltInErrorProvider",
    "brigadier/errors/DynamicCommandErrorType",
    "brigadier/errors/Dynamic2CommandErrorType",
    //"brigadier/errors/Dynamic3CommandErrorType",
    //"brigadier/errors/Dynamic4CommandErrorType",
    //"brigadier/errors/DynamicNCommandErrorType",
    "brigadier/errors/SimpleCommandErrorType",
    "brigadier/LiteralMessage",
], function(BuiltInErrorProvider, DynamicCommandErrorType, Dynamic2CommandErrorType, /*Dynamic3CommandErrorType, Dynamic4CommandErrorType, DynamicNCommandErrorType,*/ SimpleCommandErrorType, LiteralMessage) {
    //console.log("BuiltInErrors")
    var BuiltInErrors = BuiltInErrorProvider.extend({
        doubleTooLow: function(found, min) {
            return new Dynamic2CommandErrorType((found, min) => new LiteralMessage("Double must not be less than " + min + ", found " + found));
        },
    
        doubleTooHigh: function(found, max) {
            return new Dynamic2CommandErrorType((found, max) => new LiteralMessage("Double must not be more than " + max + ", found " + found));
        },
    
        floatTooLow: function(found, min) {
            return new Dynamic2CommandErrorType((found, min) => new LiteralMessage("Float must not be less than " + min + ", found " + found));
        },
    
        floatTooHigh: function(found, max) {
            return new Dynamic2CommandErrorType((found, max) => new LiteralMessage("Float must not be more than " + max + ", found " + found));
        },
    
        integerTooLow: function(found, min) {
            return new Dynamic2CommandErrorType((found, min) => new LiteralMessage("Integer must not be less than " + min + ", found " + found));
        },
    
        integerTooHigh: function(found, max) {
            return new Dynamic2CommandErrorType((found, max) => new LiteralMessage("Integer must not be more than " + max + ", found " + found));
        },
    
        longTooLow: function(found, min) {
            return new Dynamic2CommandErrorType((found, min) => new LiteralMessage("Long must not be less than " + min + ", found " + found));
        },
    
        longTooHigh: function(found, max) {
            return new Dynamic2CommandErrorType((found, max) => new LiteralMessage("Long must not be more than " + max + ", found " + found));
        },
    
        literalIncorrect: function(expected) {
            return new DynamicCommandErrorType(expected => new LiteralMessage("Expected literal " + expected));
        },
    
        readerExpectedStartOfQuote: function() {
            return new SimpleCommandErrorType(new LiteralMessage("Expected quote to start a string"));
        },
    
        readerExpectedEndOfQuote: function() {
            return new SimpleCommandErrorType(new LiteralMessage("Unclosed quoted string"));
        },
    
        readerInvalidEscape: function(character) {
            return new DynamicCommandErrorType(character => new LiteralMessage("Invalid escape sequence '" + character + "' in quoted string"));
        },
    
        readerInvalidBool: function(value) {
            return new DynamicCommandErrorType(value => new LiteralMessage("Invalid bool, expected true or false but found '" + value + "'"));
        },
    
        readerInvalidInt: function(value) {
            return new DynamicCommandErrorType(value => new LiteralMessage("Invalid integer '" + value + "'"));
        },
    
        readerExpectedInt: function() {
            return new SimpleCommandErrorType(new LiteralMessage("Expected integer"));
        },
    
        readerInvalidLong: function(value) {
            return new DynamicCommandErrorType(value => new LiteralMessage("Invalid long '" + value + "'"));
        },
    
        readerExpectedLong: function() {
            return new SimpleCommandErrorType((new LiteralMessage("Expected long")));
        },
    
        readerInvalidDouble: function(value) {
            return new DynamicCommandErrorType(value => new LiteralMessage("Invalid double '" + value + "'"));
        },
    
        readerExpectedDouble: function() {
            return new SimpleCommandErrorType(new LiteralMessage("Expected double"));
        },
    
        readerInvalidFloat: function(value) {
            return new DynamicCommandErrorType(value => new LiteralMessage("Invalid float '" + value + "'"));
        },
    
        readerExpectedFloat: function() {
            return new SimpleCommandErrorType(new LiteralMessage("Expected float"));
        },
    
        readerExpectedBool: function() {
            return new SimpleCommandErrorType(new LiteralMessage("Expected bool"));
        },
    
        readerExpectedSymbol: function(symbol) {
            return new DynamicCommandErrorType(symbol => new LiteralMessage("Expected '" + symbol + "'"));
        },
    
        dispatcherUnknownCommand: function() {
            return new SimpleCommandErrorType(new LiteralMessage("Unknown command"));
        },
    
        dispatcherUnknownArgument: function() {
            return new SimpleCommandErrorType(new LiteralMessage("Incorrect argument for command"));
        },
    
        dispatcherExpectedArgumentSeparator: function() {
            return new SimpleCommandErrorType(new LiteralMessage("Expected whitespace to end one argument, but found trailing data"));
        },
    
        dispatcherParseError: function(message) {
            return new DynamicCommandErrorType(message => new LiteralMessage("Could not parse command: " + message));
        }
    });
    return BuiltInErrors;
})