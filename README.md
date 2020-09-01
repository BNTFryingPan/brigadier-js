# brigadier-js
Brigadier-JS is a JavaScript implementation of the [Brigadier](https://github.com/Mojang/brigadier) command parser and dispatcher developed in Java by Mojang for Minecraft: Java Editon

# note
This project is currently a work in progress. It does not fully work currently. Feel free to make a PR adding any functionality that is missing, non-functional, or different from the original implementation.

# Known Issues
- Errors are a little jank still, but mostly work now. They can be handled propely as intended in the original implementation though.
- Parsing a command does not work. This is currently the highest priority issue. All i know about it is that if you have a full command entered, it will throw an "Could not parse command: undefined" error.
