# About

This is a simple library that helps you tokenize and parse your own custom files.

It is written to gracefully handle wrong input, so that a textblock can be parsed in real-time, while a user is editing it.

It outputs an array of operators and text blocks.

By default it is configured to use the following operators.

- ->
- :

Text blocks are marked with these

- ''
- ""
- ()

# Examples

With the default configuration the following string 

> "Mensch -> Hund: Hat"

will be converted to an array with the following objects:
    
    Block: Text
    Operator: ->
    Block: Hund 
    Operator: :
    Block Hat
