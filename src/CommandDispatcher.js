define([
    "brigadier/builder/LiteralArgumentBuilder",
    "brigadier/context/CommandContext",
    "brigadier/context/CommandContextBuilder",
    "brigadier/context/SuggestionContext",
    "brigadier/errors/CommandSyntaxError",
    "brigadier/suggestion/Suggestions",
    "brigadier/suggestion/SuggestionsBuilder",
    "brigadier/tree/CommandNode",
    //"brigadier/tree/LiteralCommandNode",
    "brigadier/tree/RootCommandNode",
    "brigadier/ParseResults",
    "brigadier/StringReader",
    "brigadier/ResultsConsumer",
    "brigadier/errors/BuiltInErrors"
], function(LiteralArgumentBuilder, CommandContext, CommandContextBuilder, SuggestionContext, CommandSyntaxError, Suggestions, SuggestionsBuilder, CommandNode, /*LiteralCommandNode,*/ RootCommandNode, ParseResults, StringReader, ResultsConsumer, BuiltInErrors) {
    //console.log("CommandDispatcher")
    var CommandDispatcher = Class.extend({
        init: function(root) {
            this.ARGUMENT_SEPARATOR = " ";
            this.ARGUMENT_SEPARATOR_CHAR = " ";
            this.USAGE_OPTIONAL_OPEN = "[";
            this.USAGE_OPTIONAL_CLOSE = "]";
            this.USAGE_REQUIRED_OPEN = "(";
            this.USAGE_REQUIRED_CLOSE = ")";
            this.USAGE_OR = "|";
            //debugger;
            this.root = root || new RootCommandNode();
            this.consumer = new ResultsConsumer();

            this.errors = new BuiltInErrors();
        },
    
        //hasCommand is confusing me and is unimplemeted currently
    
        register: function(command) {
            if (command instanceof LiteralArgumentBuilder) {
                let build = command.build();
                this.root.addChild(build);
                return build;
            } else throw TypeError();
        },
    
        setConsumer: function(consumer) {
            this.consumer = consumer;
        },
    
        /**
         * Parses and executes a given command.
         *
         * <p>This is a shortcut to first {@link #parse(StringReader, Object)} and then {@link #execute(ParseResults)}.</p>
         *
         * <p>It is recommended to parse and execute as separate steps, as parsing is often the most expensive step, and easiest to cache.</p>
         *
         * <p>If this command returns a value, then it successfully executed something. If it could not parse the command, or the execution was a failure,
         * then an exception will be thrown. Most exceptions will be of type {@link CommandSyntaxError}, but it is possible that a {@link ???}
         * may bubble up from the result of a command. The meaning behind the returned result is arbitrary, and will depend
         * entirely on what command was performed.</p>
         *
         * <p>If the command passes through a node that is {@link CommandNode#isFork()} then it will be 'forked'.
         * A forked command will not bubble up any {@link CommandSyntaxError}s, and the 'result' returned will turn into
         * 'amount of successful commands executes'.</p>
         *
         * <p>After each and any command is ran, a registered callback given to {@link #setConsumer(ResultConsumer)}
         * will be notified of the result and success of the command. You can use that method to gather more meaningful
         * results than this method will return, especially when a command forks.</p>
         *
         * @param {String|StringReader|ParseResults} input a command string to parse, or the ParseResults directly
         * @param {Object|null} source a custom "source" object, usually representing the originator of this command, can only be omitted if input is ParseResults
         * @return {Number} a numeric result from a "command" that was performed
         * @throws {CommandSyntaxError} if the command failed to parse or execute
         * @throws {Error} if the command failed to execute and was not handled gracefully
         */
        execute: function(input, source) {
            if (!source) {
                if (!(input instanceof ParseResults)) {
                    throw TypeError();
                } else {
                    let parse = input;
                    if (parse.getReader().canRead()) {
                        if (parse.getErrors().length == 1) {
                            throw parse.getErrors()[0]
                        } else if (parse.getContext().getRange().isEmpty()) {
                            throw this.errors.dispatcherUnknownCommand().createWithContext(parse.getReader());
                        } else {
                            throw this.errors.dispatcherUnknownArgument().createWithContext(parse.getReader());
                        }
                    }
    
                    let result = 0;
                    let successfulForks = 0;
                    let forked = false;
                    let foundCommand = false;
                    let command = parse.getReader().getString();
                    let original = parse.getContext().build(command);
                    let contexts = [original];
                    /**
                     * @type {Array}
                     */
                    let next = null;
    
                    while (contexts) {
                        let size = contexts.length;
                        for (let i = 0; i < size; i++) {
                            /**
                             * @type {CommandContext}
                             */
                            let context = contexts[i];
                            /**
                             * @type {CommandContext}
                             */
                            let child = context.getChild();
    
                            if (child) {
                                forked |= context.isForked();
                                if (child.hasNodes()) {
                                    foundCommand = true;
                                    let modifier = context.getRedirectModifier();
                                    if (!modifier) {
                                        if (!next) {
                                            next = []
                                        }
                                        next.push(child.copyFor(context.getSource()))
                                    } else {
                                        try {
                                            let results = modifier.apply(context);
                                            if (result != []) {
                                                if (!next) {
                                                    next = []
                                                }
                                                for (let source in results) {
                                                    next.push(child.copyFor(source));
                                                }
                                            }
                                        } catch (e) {
                                            this.consumer.onCommandComplete(context, false, 0)
                                            if (!forked) {
                                                throw e
                                            }
                                        }
                                    }
                                }
                            } else if (context.getCommand()) {
                                foundCommand = true;
                                try {
                                    let value = context.getCommand().run(context);
                                    result += value;
                                    this.consumer.onCommandComplete(context, true, value);
                                    successfulForks++;
                                } catch (e) {
                                    this.consumer.onCommandComplete(context, false, 0);
                                    if (!forked) {
                                        throw e
                                    }
                                }
                            }
                        }
    
                        contexts = next;
                        next = null;
                    }
    
                    if (!foundCommand) {
                        this.consumer.onCommandComplete(original, false, 0);
                        throw this.errors.dispatcherUnknownCommand().createWithContext(parse.getReader());
                    }
    
                    return forked ? successfulForks : result;
                }
            } else {
                if ((typeof input) == "string") {
                    return this.execute(new StringReader(input), source);
                } else if (input instanceof StringReader) {
                    let p = this.parse(input, source)
                    return this.execute(p)
                } else {
                    throw TypeError();
                }
            }
        },
    
        /**
         * Parses a given command.
         *
         * <p>The result of this method can be cached, and it is advised to do so where appropriate. Parsing is often the
         * most expensive step, and this allows you to essentially "precompile" a command if it will be ran often.</p>
         *
         * <p>If the command passes through a node that is {@link CommandNode#isFork()} then the resulting context will be marked as 'forked'.
         * Forked contexts may contain child contexts, which may be modified by the {@link RedirectModifier} attached to the fork.</p>
         *
         * <p>Parsing a command can never fail, you will always be provided with a new {@link ParseResults}.
         * However, that does not mean that it will always parse into a valid command. You should inspect the returned results
         * to check for validity. If its {@link ParseResults#getReader()} {@link StringReader#canRead()} then it did not finish
         * parsing successfully. You can use that position as an indicator to the user where the command stopped being valid.
         * You may inspect {@link ParseResults#getExceptions()} if you know the parse failed, as it will explain why it could
         * not find any valid commands. It may contain multiple exceptions, one for each "potential node" that it could have visited,
         * explaining why it did not go down that node.</p>
         *
         * <p>When you eventually call {@link #execute(ParseResults)} with the result of this method, the above error checking
         * will occur. You only need to inspect it yourself if you wish to handle that yourself.</p>
         *
         * @param {StringReader|String} command a command string to parse
         * @param {Object} source a custom "source" object, usually representing the originator of this command
         * @return {ParseResults} the result of parsing this command
         */
        parse: function(command, source) {
            if (typeof command == "string") {
                command = new StringReader(command)
            }
            let context = new CommandContextBuilder(this, source, this.root, command.getCursor())
            return this.parseNodes(this.root, command, context);
        },
    
        /**
         * 
         * @param {CommandNode} node 
         * @param {StringReader} originalReader 
         * @param {CommandContextBuilder} contextSoFar 
         * @return {ParseResults}
         */
        parseNodes: function(node, originalReader, contextSoFar) {
            let source = contextSoFar.getSource();
            let errors = null;
            /**
             * @type {}
             */
            let potentials = null;
            let cursor = originalReader.getCursor();
    
            for (child in node.getRelevantNodes(originalReader)) {
                if (!child.canUse(source)) {
                    continue;
                }
                let context = contextSoFar.copy();
                let reader = new StringReader(originalReader);
                try {
                    try{
                        child.parse(reader, context);
                    } catch (e) {
                        throw CommandSyntaxError.BUILT_IN_ERRORS.dispatcherParseException().createWithContext(reader, e.toString());
                    }
                    if (reader.canRead()) {
                        if (reader.peek() != this.ARGUMENT_SEPARATOR_CHAR) {
                            throw CommandSyntaxError.BUILT_IN_ERRORS.dispatcherExpectedArgumentSeparator().createWithContext(reader);
                        }
                    }
                } catch (e) {
                    if (!errors) {
                        errors = {}
                    }
                    errors[child] = e;
                    reader.setCursor(cursor);
                    continue;
                }
    
                context.withCommand(child.getCommand());
                if (reader.canRead(child.getRedirect() == null ? 2 : 1)) {
                    reader.skip();
                    if (child.getRedirect()) {
                        let childContext = new CommandContextBuilder(this, source, child.getRedirect(), reader.getCursor());
                        let parse = this.parseNodes(child, reader, childContext);
                        context.withChild(parse.getContext());
                        return new ParseResults(context, parse.getReader(), parse.getErrors());
                    } else {
                        let parse = this.parseNodes(child, reader, context);
                        if (!potentials) {
                            potentials = []
                        }
                        potentials.push(parse);
                    }
                }
            }
    
            if (potentials) {
                if (potentials.length > 1) {
                    potentials.sort((a, b) => {
                        if (!a.getReader().canRead()         &&  b.getReader().canRead())         return -1;
                        if ( a.getReader().canRead()         && !b.getReader().canRead())         return  1;
                        if ( a.getReader().getErrors() == [] && !b.getReader().getErrors() == []) return -1;
                        if (!a.getReader().getErrors() == [] &&  b.getReader().getErrors() == []) return  1;
                        return 0
                    });
                }
                return potentials[0];
            }
    
            return new ParseResults(contextSoFar, originalReader, errors == null ? [] : errors);
        },
    
        /**
         * Gets all possible executable commands following the given node.
         *
         * <p>You may use {@link #getRoot()} as a target to get all usage data for the entire command tree.</p>
         *
         * <p>The returned syntax will be in "simple" form: {@code <param>} and {@code literal}. "Optional" nodes will be
         * listed as multiple entries: the parent node, and the child nodes.
         * For example, a required literal "foo" followed by an optional param "int" will be two nodes:</p>
         * <ul>
         *     <li>{@code foo}</li>
         *     <li>{@code foo <int>}</li>
         * </ul>
         *
         * <p>The path to the specified node will <b>not</b> be prepended to the output, as there can theoretically be many
         * ways to reach a given node. It will only give you paths relative to the specified node, not absolute from root.</p>
         *
         * @param {CommandNode} node target node to get child usage strings for
         * @param {Object} source a custom "source" object, usually representing the originator of this command
         * @param {Boolean} restricted if true, commands that the {@code source} cannot access will not be mentioned
         * @return array of full usage strings under the target node
         */
        getAllUsage: function(node, source, restricted) {
            let result = [];
            this._getAllUsage(node, source, result, "", restricted);
            return result
    
        },
    
        /**
         * 
         * @param {CommandNode} node 
         * @param {*} source 
         * @param {Array} result 
         * @param {String} prefix 
         * @param {Boolean} restricted 
         */
        _getAllUsage: function(node, source, result, prefix, restricted) {
            if (restricted && !node.canUse(source)) {
                return;
            }
    
            if (node.getCommand()) {
                result.push(prefix);
            }
    
            if (node.getRedirect()) {
                let redirect = ( node.getRedirect() == root ? "..." : "-> " ) + node.getRedirect().getUsageText();
                result.push(prefix == "" ? node.getUsageText() + this.ARGUMENT_SEPARATOR + redirect : prefix + this.ARGUMENT_SEPARATOR + redirect);
            } else if (node.getChildren() != []) {
                let _children = node.getChildren()
                for (let child in node.getChildren()) {
                    this._getAllUsage(_children[child], source, result, prefix == "" ? _children[child].getUsageText() : prefix + this.ARGUMENT_SEPARATOR + _children[child].getUsageText(), restricted)
                }
            }
        },
    
        /**
         * Gets the possible executable commands from a specified node.
         *
         * <p>You may use {@link #getRoot()} as a target to get usage data for the entire command tree.</p>
         *
         * <p>The returned syntax will be in "smart" form: {@code <param>}, {@code literal}, {@code [optional]} and {@code (either|or)}.
         * These forms may be mixed and matched to provide as much information about the child nodes as it can, without being too verbose.
         * For example, a required literal "foo" followed by an optional param "int" can be compressed into one string:</p>
         * <ul>
         *     <li>{@code foo [<int>]}</li>
         * </ul>
         *
         * <p>The path to the specified node will <b>not</b> be prepended to the output, as there can theoretically be many
         * ways to reach a given node. It will only give you paths relative to the specified node, not absolute from root.</p>
         *
         * <p>The returned usage will be restricted to only commands that the provided {@code source} can use.</p>
         *
         * @param {CommandNode} node target node to get child usage strings for
         * @param {*} source a custom "source" object, usually representing the originator of this command
         * @return array of full usage strings under the target node
         */
        getSmartUsage: function(node, source) {
            let result = [];
            let optional = node.getCommand() != null;
    
            let _children = node.getChildren()
            for (let child in _children) {
                let usage = this._getSmartUsage(_children[child], source, optional, false);
                if (usage) {
                    result.push(usage);
                }
            }
    
            return result;
        },
    
        /**
         * 
         * @param {CommandNode} node 
         * @param {*} source 
         * @param {Boolean} optional 
         * @param {Boolean} deep
         * @returns {String}
         */
        _getSmartUsage: function(node, source, optional, deep) {
            if (!node.canUse(source)) {
                return null;
            }
    
            let self = optional ? this.USAGE_OPTIONAL_OPEN + node.getUsageText() + this.USAGE_OPTIONAL_CLOSE : node.getUsageText();
            let childOptional = node.getCommand() != null;
            let open = childOptional ? this.USAGE_OPTIONAL_OPEN : this.USAGE_REQUIRED_OPEN;
            let close = childOptional ? this.USAGE_OPTIONAL_CLOSE : this.USAGE_REQUIRED_CLOSE;
    
            if (!deep) {
                if (node.getRedirect()) {
                    let redirect = node.getRedirect() == this.root ? "..." : "-> " + node.getRedirect().getUsageText();
                    return self + this.ARGUMENT_SEPARATOR + redirect;
                } else {
                    /**
                     * @type {CommandNode[]}
                     */
                    let children = node.getChildren().filter(c => c.canUse(source));
                    if (children.length == 1) {
                        let usage = this._getSmartUsage(children[0], source, childOptional, childOptional);
                        if (usage) {
                            return self + this.ARGUMENT_SEPARATOR + usage;
                        }
                    } else if (children.length > 1) {
                        let childUsage = [];
                        for (let child in children) {
                            let usage = this._getSmartUsage(children[child], source, childOptional, true)
                            if (usage) {
                                childUsage.push(usage);
                            }
                        }
    
                        if (childUsage.length == 1) {
                            let usage = childUsage[0];
                            return self + this.ARGUMENT_SEPARATOR + (childOptional ? this.USAGE_OPTIONAL_OPEN + usage + this.USAGE_OPTIONAL_CLOSE : usage);
                        } else if (childUsage.length > 1) {
                            let builder = "" + open;
                            let count = 0;
                            for (let child in children) {
                                if (count > 0) {
                                    builder += (this.USAGE_OR);
                                }
                                builder += children[child].getUsageText();
                                count++;
                            }
                            if (count > 0) {
                                builder += close;
                                return self + this.ARGUMENT_SEPARATOR + builder;
                            }
                        }
                    }
                }
            }
    
            return self;
        },
    
        /**
         * Gets suggestions for a parsed input string on what comes next.
         *
         * <p>As it is ultimately up to custom argument types to provide suggestions, it may be an asynchronous operation,
         * for example getting in-game data or player names etc. As such, this method returns a future and no guarantees
         * are made to when or how the future completes.</p>
         *
         * <p>The suggestions provided will be in the context of the end of the parsed input string, but may suggest
         * new or replacement strings for earlier in the input string. For example, if the end of the string was
         * {@code foobar} but an argument preferred it to be {@code minecraft:foobar}, it will suggest a replacement for that
         * whole segment of the input.</p>
         *
         * @param {ParseResults} parse the result of a {@link #parse(StringReader, Object)}
         * @returns {*}
         */
        getCompletionSuggestions: function(parse) {
            return this._getCompletionSuggestions(parse, parse.getReader().getTotalLength())
        },
    
        /**
         * 
         * @param {ParseResults} parse 
         * @param {Number} cursor 
         * @returns {*}
         */
        _getCompletionSuggestions: function(parse, cursor) { // this probably doesnt work!
            /**
             * @type {CommandContextBuilder}
             */
            let context = parse.getContext();
    
            /**
             * @type {SuggestionContext}
             */
            let nodeBeforeCursor = context.findSuggestionContext(cursor);
    
            /**
             * @type {CommandNode}
             */
            let parent = nodeBeforeCursor.parent;
    
            /**
             * @type {Number}
             */
            let start = Math.min(nodeBeforeCursor.startPos, cursor);
    
            /**
             * @type {String}
             */
            let fullInput = parse.getReader().getString();
    
            /**
             * @type {String}
             */
            let truncatedInput = fullInput.substring(0, cursor);
    
            
            let futures = []
    
            for (let node in parent.getChildren()) {
                let future = Suggestions.empty()
                try {
                    future = node.listSuggestions(context.build(truncatedInput), new SuggestionsBuilder(truncatedInput, start));
                } catch (err) {
                    if (!(err instanceof CommandSyntaxError)) {
                        throw err
                    }
                }
                futures.push(future);
            }
    
            let result = Suggestions.EMPTY;
            futures.forEach(f => {
                let suggestions = [];
                for (let future in futures) {
                    suggestions.push(future);
                }
                result.merge(fullInput, suggestions)
            });
    
            return result;
            /**
            final CommandContextBuilder<S> context = parse.getContext();
    
            final SuggestionContext<S> nodeBeforeCursor = context.findSuggestionContext(cursor);
            final CommandNode<S> parent = nodeBeforeCursor.parent;
            final int start = Math.min(nodeBeforeCursor.startPos, cursor);
    
            final String fullInput = parse.getReader().getString();
            final String truncatedInput = fullInput.substring(0, cursor);
            @SuppressWarnings("unchecked") final CompletableFuture<Suggestions>[] futures = new CompletableFuture[parent.getChildren().size()];
            int i = 0;
            for (final CommandNode<S> node : parent.getChildren()) {
                CompletableFuture<Suggestions> future = Suggestions.empty();
                try {
                    future = node.listSuggestions(context.build(truncatedInput), new SuggestionsBuilder(truncatedInput, start));
                } catch (final CommandSyntaxException ignored) {
                }
                futures[i++] = future;
            }
    
            final CompletableFuture<Suggestions> result = new CompletableFuture<>();
            CompletableFuture.allOf(futures).thenRun(() -> {
                final List<Suggestions> suggestions = new ArrayList<>();
                for (final CompletableFuture<Suggestions> future : futures) {
                    suggestions.add(future.join());
                }
                result.complete(Suggestions.merge(fullInput, suggestions));
            });
    
            return result;
             */
        },
    
        /**
         * Gets the root of this command tree.
         *
         * <p>This is often useful as a target of a {@link com.mojang.brigadier.builder.ArgumentBuilder#redirect(CommandNode)},
         * {@link #getAllUsage(CommandNode, Object, boolean)} or {@link #getSmartUsage(CommandNode, Object)}.
         * You may also use it to clone the command tree via {@link #CommandDispatcher(RootCommandNode)}.</p>
         *
         * @return {RootCommandNode} root of the command tree
         */
        getRoot: function() {
            return this.root;
        },
    
        /**
         * Finds a valid path to a given node on the command tree.
         *
         * <p>There may theoretically be multiple paths to a node on the tree, especially with the use of forking or redirecting.
         * As such, this method makes no guarantees about which path it finds. It will not look at forks or redirects,
         * and find the first instance of the target node on the tree.</p>
         *
         * <p>The only guarantee made is that for the same command tree and the same version of this library, the result of
         * this method will <b>always</b> be a valid input for {@link #findNode(Collection)}, which should return the same node
         * as provided to this method.</p>
         *
         * @param {CommandNode} target the target node you are finding a path for
         * @return {String[]} a path to the resulting node, or an empty list if it was not found
         */
        getPath: function(target) {
            let nodes = [];
            this.addPaths(this.root, nodes, [])
    
            for (let list in nodes) {
                if (list[list.length - 1] == target) {
                    let result = [];
                    for (let node in list) {
                        if (node != this.root) {
                            result.push(node.getName())
                        }
                    }
                    return result;
                }
            }
    
            return [];
        },
    
        /**
         * Finds a node by its path
         *
         * <p>Paths may be generated with {@link #getPath(CommandNode)}, and are guaranteed (for the same tree, and the
         * same version of this library) to always produce the same valid node by this method.</p>
         *
         * <p>If a node could not be found at the specified path, then {@code null} will be returned.</p>
         *
         * @param {String[]} path a generated path to a node
         * @returns {CommandNode} the node at the given path, or null if not found
         */
        findNode: function(path) {
            let node = this.root;
            for (let name in path) {
                node = node.getChild(name);
                if (!node) {
                    return null;
                }
            }
            return node;
        },
    
        /**
         * Scans the command tree for potential ambiguous commands.
         *
         * <p>This is a shortcut for {@link CommandNode#findAmbiguities(AmbiguityConsumer)} on {@link #getRoot()}.</p>
         *
         * <p>Ambiguities are detected by testing every {@link CommandNode#getExamples()} on one node verses every sibling
         * node. This is not fool proof, and relies a lot on the providers of the used argument types to give good examples.</p>
         *
         * @param {AmbiguityConsumer} consumer a callback to be notified of potential ambiguities
         */
        findAmbiguities: function(consumer) {
            this.root.findAmbiguities(consumer);
        },
    
        /**
         * 
         * @param {CommandNode} node 
         * @param {CommandNode[][]} result 
         * @param {CommandNode[]} parents 
         */
        addPaths: function(node, result, parents) {
            /**
             * @type {Array}
             */
            let current = common.clone(parents);
            current.push(node);
            result.push(current);
    
            for (let child in node.getChildren()) {
                this.addPaths(child, result, current)
            }
        }
    })
    return CommandDispatcher;
})