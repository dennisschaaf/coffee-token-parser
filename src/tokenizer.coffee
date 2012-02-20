class Operator 
  constructor: (text) ->
    @type = 'Operator'
    @text = text

class Block 
  constructor: (text, wrap = '') ->
    @type = 'Block'
    @text = text
    @wrap = wrap

class Tokenizer    
  constructor: ->
    @operators = [ "->", ":"]
    @wrappers = ["''", '""', '()']

  # recursive function that extracts one token from the beginning of the string with each iteration
  tokenizeLine: (line, lastToken = {}) ->
      line = line.trim();
      #console.log(' token line :', line )
      if(line == "" || line == "'" || line == '"') 
        return []

      # test first if this is an escaped section
      for wrapper in @wrappers
        if(line[0] == wrapper[0])
          #it's an escaped block, find the end
          wrapend = line.indexOf(wrapper[1],1)
          #if there is no end, ignore the symbol
           

          if(wrapend == -1) 
            if(lastToken.type == 'Block' and lastToken.wrap == '')
              lastToken.text += line[0]
              return @tokenizeLine(line.slice(1), lastToken)
            else 
              block = new Block(line[0]);
              return [block].concat(@tokenizeLine(line.slice(1), block))

            
            break;
          else
            wrap = new Block(line.slice(1,wrapend), wrapper)
            return [wrap].concat(@tokenizeLine(line.slice(wrapend+1)))
      
      

      # if it's an operator
      for operator  in @operators
        if(line.slice(0,operator.length) == operator)
          op = new Operator(operator)
          return [op].concat(@tokenizeLine(line.slice(operator.length)))
      
      # else it's a text block ending with the next wrapper, command or the end of the line
      lastElement = line.length;
      
      for wrapper in @wrappers
        idx = line.indexOf(wrapper[0])
        if(idx < lastElement && idx > -1)
          lastElement = idx
      
      for operator in @operators
        idx = line.indexOf(operator)
        if(idx < lastElement && idx > -1)
          lastElement = idx
      
      blocktext = line.slice(0,lastElement).trim();

      # if the last token also was a block with nowrap
      # attach this text to that token instead
      if(lastToken.type == 'Block' and lastToken.wrap == '')
        lastToken.text += blocktext
        return @tokenizeLine(
          line.slice(lastElement),
          lastToken);

      
      block = new Block(blocktext);
      return [block].concat(
        @tokenizeLine(
          line.slice(lastElement),
          block));

  tokenize: (text) ->
    tokens = []
    # to do
    # make multi line
    lines = text.split('\n');
    for line in lines
      lineTokens = @tokenizeLine(line)
      if(lineTokens.length > 0) 
        tokens = tokens.concat(lineTokens)
        
        # insert new line unless it ends in an opearator
        # in this case the command is split over several lines
        unless (lineTokens[lineTokens.length - 1].type == 'Operator')
          tokens.push('\n')
    
    return tokens

module?.exports = new Tokenizer
window?.Tokenizer = new Tokenizer
