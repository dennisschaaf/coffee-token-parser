Tokenizer = require("../client/assets/script/tokenizer");

exports.testReturnedStructure = function(test) {
  var result = Tokenizer.tokenize("Mensch -> Hund: Hat");
  test.equal(result.length, 6);
  //test.ok(result[tokens]);
  //console.log(result);
  test.done();
}

exports.testSimpleArrow = function(test) {
  test.deepEqual(
    Tokenizer.tokenize("Mensch -> Hund: Hat"), 

    [ { type: 'Block', text: 'Mensch', wrap: '' },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund', wrap: '' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Hat', wrap: '' },
      '\n' ])

    //    ["Mensch", "->", "Hund", ":", "Hat"]);
  test.done();
}

exports.testSimpleArrowSingleCharacters = function(test) {
  test.deepEqual(
    Tokenizer.tokenize("A -> B: C"), 

    [ { type: 'Block', text: 'A', wrap: '' },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'B', wrap: '' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'C', wrap: '' },
      '\n' ])

    //    ["Mensch", "->", "Hund", ":", "Hat"]);
  test.done();
}

exports.testBracketWrapper = function(test) {
  test.deepEqual(
    Tokenizer.tokenize("(Test)"), 

    [ { type: 'Block', text: 'Test', wrap: '()' },
      '\n' ])

  test.deepEqual(
    Tokenizer.tokenize("a: b(Test)"), 

    [ { type: 'Block', text: 'a', wrap: '' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'b', wrap: '' },
      { type: 'Block', text: 'Test', wrap: '()' },
      '\n' ])

    //    ["Mensch", "->", "Hund", ":", "Hat"]);
  test.done();
}

exports.testIgnoreWhitespace = function(test) {
  test.deepEqual(
    Tokenizer.tokenize("Mensch    -> Hund:   Hat")
    , 
    [ { type: 'Block', text: 'Mensch', wrap: '' },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund', wrap: '' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Hat', wrap: '' },
      '\n' ]
  );
  test.done();
}


exports.testWhitespaceMattersWithQuotations = function(test) {
  test.deepEqual(Tokenizer.tokenize(
    "' Mensch'-> Hund:   Hat"), 
    [ { type: 'Block', text: ' Mensch', wrap: "''" },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund', wrap: '' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Hat', wrap: '' },
      '\n' ]
  );
  test.done();
}

exports.testWrappingWithCommandInside = function(test) {
  test.deepEqual(
    Tokenizer.tokenize("'Mensch: '-> Hund:   Hat")
    , 
    [ { type: 'Block', text: 'Mensch: ', wrap: "''" },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund', wrap: '' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Hat', wrap: '' },
      '\n' ]);
  
  test.deepEqual(
    Tokenizer.tokenize("'Mensch -> '-> \"Hund : House -> \": Hat"), 
    [ { type: 'Block', text: 'Mensch -> ', wrap: "''" },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund : House -> ', wrap: '""'  },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Hat', wrap: '' },
      '\n' ]);

  test.done();
}

exports.testSimpleArrowNoText = function(test) {
  test.deepEqual(Tokenizer.tokenize(
    "Mensch -> Hund"), 
    [ { type: 'Block', text: 'Mensch', wrap: "" },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund', wrap: ''  },
      '\n' ]);
  test.done();
}

exports.testSimpleArrowNoTextNoSpace = function(test) {
  test.deepEqual(Tokenizer.tokenize(
    "Mensch->Hund"), 
    [ { type: 'Block', text: 'Mensch', wrap: "" },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund', wrap: ''  },
      '\n' ]);
  test.done();
}

exports.testProcessString = function(test) {
  test.deepEqual(Tokenizer.tokenize(
    "Mensch: Bla -> Hund:Bla"), 
    [ { type: 'Block', text: 'Mensch', wrap: "" },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Bla', wrap: ''  },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund', wrap: ''  },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Bla', wrap: ''  },      
      '\n' ])
  test.done();
}

exports.testProcessMultiLine = function(test) {
  test.deepEqual(Tokenizer.tokenize(
    "Mensch -> Hund : Bla \n"+
        "Hund -> Mensch: Test"), 
 
    [ { type: 'Block', text: 'Mensch', wrap: "" },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund', wrap: ''  },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Bla', wrap: ''  },     
      '\n', 
      { type: 'Block', text: 'Hund', wrap: "" },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Mensch', wrap: '' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Test', wrap: ''  },     
      '\n', ])

  test.done();
}

exports.testProcessStringOverSeveralLines = function(test) {
  test.deepEqual(Tokenizer.tokenize(
      "Mensch: Bla -> \r\n"+
        " Hund"), 

      [{ type: 'Block', text: 'Mensch', wrap: "" },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Bla', wrap: '' },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'Hund', wrap: ''  },     
      '\n', ])

  test.done();
}

exports.testOneSingleQuoteRemainsInBuffer = function(test) {
  tokens = Tokenizer.tokenize("A' -> B:C");

  test.deepEqual(
    tokens, 
    [{ type: 'Block', text: "A'", wrap: "" },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: 'B', wrap: '' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'C', wrap: ''  },     
      '\n', ])
  
  test.deepEqual(Tokenizer.tokenize("A -> 'B : C"),
   [{ type: 'Block', text: 'A', wrap: "" },
      { type: 'Operator', text: '->' },
      { type: 'Block', text: "'B", wrap: '' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'C', wrap: ''  },     
      '\n', ])
  
  test.done();
}

exports.testLabels = function(test) {
  tokens = Tokenizer.tokenize("Label");
  test.deepEqual(
    tokens, 
    [{ type: 'Block', text: "Label", wrap: "" },
      '\n', ])
  
  test.deepEqual(Tokenizer.tokenize(": Label"),
   [ { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Label', wrap: "" },
      '\n', ])
  
  test.deepEqual(Tokenizer.tokenize(":: Label"),
   [ { type: 'Operator', text: ':' },
      { type: 'Operator', text: ':' },
      { type: 'Block', text: 'Label', wrap: "" },
      '\n', ])
  
  test.done();
}


exports.testNestedFnVaribles = function(test) {
  console.log('tokens' );

  function a () {
    t += 2
  }

  function b () {
    t = 1
    a();
    test.equal(t, 3)
  }

  b();
  test.done()
}

/*
What does this test do?
exports.testTokenizerIsRobust = function(test) {
  test.deepEqual(Tokenizer.tokenize("Mensch -> Hund : asd\nHund"), ["Mensch", "->", "Hund", ":", "asd", "\n", "Hund"]);
  test.deepEqual(Tokenizer.tokenize("Mensch -> : Hund : asd\nHund"), ["Mensch", "->", "Hund", ":", "asd", "\n", "Hund"]);
  test.deepEqual(Tokenizer.tokenize("Mensch -> \n Hund : asd\nHund"), ["Mensch", "->", "Hund", ":", "asd", "\n", "Hund"]);
  test.done();
}

exports.testCanHandleLongProcessString = function(test) {
  test.deepEqual(Tokenizer.tokenize("A -> B\nA->B:Blabla\nB->A\nB:Test->A:Testaaa"), ["A", "->", "B", "\n", "A", "->", "B", ":", "Blabla", "\n", "B", "->", "A", "\n", "B", ":", "Test", "->", "A", ":", "Testaaa"]);
  test.done();
}
*/