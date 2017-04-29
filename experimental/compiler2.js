
// Мы предполагаем, что исходный текст уже преобразован в массив tokens примитивных лексем, в которых содержится поле type ("name", "string", "number", или "operator"), и поле value (строка или число). Переменная token всегда ссылается на текущую лексему.

class Token {
    constructor(type,val){
        this.tokenType = type;
        this.tokenValue = val;
    }
}

Token.OPERATOR = {
    GT:'>',
    LT:'<',
    DIVIDE:'/',
    MULTIPLY:'*',
    PLUS:'+',
    MINUS:'-',
    AMPERSAND:'&',
    OR:'|',
    EQUAL:'='

};

Token.SYMBOL = {
    L_PAR:'(',
    R_PAR:')',
    L_CURLY:'{',
    R_CURLY:'}',
    L_SQUARE:'[',
    R_SQUARE: ']',
    COMMA:',',
    QUESTION:'?',
    COLON:':',
    EXCLAMATION:'!',
    SEMICOLON:';'
};

Token.KEY_WORDS = ['in','of','null','undefined'];

Token.ALL_OPERATORS =
    Object.keys(Token.OPERATOR).
    map(key=>{return Token.OPERATOR[key]});

Token.ALL_SPECIAL_SYMBOLS =
    Object.keys(Token.SYMBOL).
    map(key=>{return Token.SYMBOL[key]}).
    concat(
        Token.ALL_OPERATORS
    );

Token.TYPE = {
    OPERATOR: 'OPERATOR',
    DIGIT:      'DIGIT',
    VARIABLE:   'VARIABLE',
    STRING:     'STRING',
    BOOLEAN:    'BOOLEAN',
    KEY_WORD:   'KEY_WORD',
    FUNCTION:   'FUNCTION'
};

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function charInArr(char,arr) {
    return char && arr.indexOf(char)>-1;
}

class Tokenizer {

    static _toTokens(expression){
        let tokens = [], t, lastChar = '';
        expression.trim().split('').forEach(function(char,i) {

            let lastToken = tokens[tokens.length - 1]; // previous token

            if (charInArr(char, Token.ALL_SPECIAL_SYMBOLS)) {
                t = new Token(Token.TYPE.OPERATOR, char);
                tokens.push(t);
                lastChar = char;

            } else {
                if (lastToken && lastToken.tokenType != Token.TYPE.STRING && char == ' ')
                    return;
                if (
                    lastToken &&
                    (
                        lastToken.tokenType == Token.TYPE.DIGIT ||
                        lastToken.tokenType == Token.TYPE.VARIABLE ||
                        lastToken.tokenType == Token.TYPE.STRING
                    )
                ) { // continue token
                    lastToken.tokenValue += char;
                } else { // new token
                    let type;
                    if(isNumber(char)) type = Token.TYPE.DIGIT;
                    else if (charInArr(char,['"',"'"])) type = Token.TYPE.STRING;
                    else type = Token.TYPE.VARIABLE;
                    t = new Token(type,char);
                    tokens.push(t);
                }
                lastChar = char;
            }
        });
        return tokens;
    }

    static isOperandStronger(opA,opB){
        let indexOfA = Token.ALL_OPERATORS.indexOf(opA);
        if (indexOfA==-1) throw `unknown operand ${opA}`;
        let indexOfB = Token.ALL_OPERATORS.indexOf(opB);
        if (indexOfB==-1) throw `unknown operand ${opB}`;
        return indexOfA<indexOfB;
    }

    static _postProcessTokens(tokens){
        tokens.forEach((t,i)=>{
            if (charInArr(t.tokenValue,Token.KEY_WORDS)){
                t.tokenType = Token.TYPE.KEY_WORD;
            }
            if (charInArr(t.tokenValue,['true','false'])){
                t.tokenType = Token.TYPE.BOOLEAN;
            }
            if (t.tokenType==Token.TYPE.VARIABLE) {
                if (tokens[i+1] && tokens[i+1].tokenValue==Token.SYMBOL.L_PAR)
                    t.tokenType = Token.TYPE.FUNCTION;
            }
            if (t.tokenType==Token.TYPE.STRING) {
                let firstChar = t.tokenValue[0];
                let lastChar = t.tokenValue[t.tokenValue.length-1];
                if (
                    !charInArr(firstChar,['"',"'"] ||
                        firstChar!==lastChar
                    )
                ) throw `unexpected character at ${t.tokenValue}`;
                t.tokenValue = t.tokenValue.substr(1,t.tokenValue.length-2);
            }
        });
    }

    static tokenize(expression) {
        let tokens = Tokenizer._toTokens(expression);
        Tokenizer._postProcessTokens(tokens);
        return tokens;
    }

}

class LexNode {
    constructor(opts){
        this.operand = opts.operand;
        this.left = opts.left;
        this.right = opts.right;
    }
}

class Lexer {
    static buildAST(expression){
        let tokens = Tokenizer.tokenize(expression);
        let currNode = null;
        let rootNode = null;
        tokens.forEach(t=>{
            if (!currNode) {
                currNode = new LexNode({left:'',right:'',operand:''});
                rootNode = currNode;
            }
            if (charInArr(t.tokenValue,Token.ALL_OPERATORS)) {
                currNode.operand = t.tokenValue;
                if(
                    currNode.operand &&
                    currNode._parentOperand &&
                    Tokenizer.isOperandStronger(currNode.operand,currNode._parentOperand)
                ) {
                    //currNode.left
                }
                let rightNode = new LexNode({left:'',right:'',operand:''});
                rightNode._parentOperand = currNode.operand;
                currNode.right = rightNode;
                currNode = rightNode;
            } else {
                currNode.left = t;
            }
        });
        return rootNode;
    }
}