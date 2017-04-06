
class Token {
    constructor(type,val){
        this.tokenType = type;
        this.tokenValue = val;
    }
}


Token.SYMBOL = {
    L_PAR:'(',
    R_PAR:')',
    L_CURLY:'{',
    R_CURLY:'}',
    L_SQUARE:'[',
    R_SQUARE: ']',
    COMMA:',',
    PLUS:'+',
    MULTIPLY:'*',
    MINUS:'-',
    DIVIDE:'/',
    GT:'>',
    LT:'<',
    EQUAL:'=',
    QUESTION:'?',
    COLON:':',
    AMPERSAND:'&',
    OR:'|',
    EXCLAMATION:'!',
    SEMICOLON:';'
};

Token.KEY_WORDS = ['in','of','null','undefined'];

Token.ALL_SPECIAL_SYMBOLS = Object.keys(Token.SYMBOL).map(key=>{return Token.SYMBOL[key]});

Token.TYPE = {
    SPECIAL_SYMBOL: 'SPECIAL_SYMBOL',
    DIGIT:      'DIGIT',
    VARIABLE:   'VARIABLE',
    STRING:     'STRING',
    OBJECT_KEY: 'OBJECT_KEY',
    FUNCTION:   'FUNCTION',
    BOOLEAN:    'BOOLEAN',
    KEY_WORD:   'KEY_WORD'
};

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function charInArr(char,arr) {
    return char && arr.indexOf(char)>-1;
}

class Lexer {

    static tokenize(expression) {
        let isEndWithSemicolon = expression[expression.length-1]==Token.SYMBOL.SEMICOLON;
        let tokens = [], t, lastChar = '';
        expression = expression.trim();
        if (!isEndWithSemicolon) expression = expression+Token.SYMBOL.SEMICOLON;
        expression.split('').forEach(function(char,i) {

            let lastToken = tokens[tokens.length - 1];
            if (lastToken && charInArr(lastToken.tokenValue,['true','false']))
                lastToken.tokenType = Token.TYPE.BOOLEAN;

            if (charInArr(char, Token.ALL_SPECIAL_SYMBOLS)) {
                t = new Token(Token.TYPE.SPECIAL_SYMBOL, char);
                tokens.push(t);
                lastChar = char;
                if (!lastToken) return;
                if (char==Token.SYMBOL.L_PAR) lastToken.tokenType = Token.TYPE.FUNCTION;

            } else {
                if (lastToken && lastToken.tokenType != Token.TYPE.STRING && char == ' ') return;
                if (
                    lastToken &&
                    (
                        lastToken.tokenType == Token.TYPE.DIGIT ||
                        lastToken.tokenType == Token.TYPE.VARIABLE ||
                        lastToken.tokenType == Token.TYPE.STRING
                    )
                ) {
                    lastToken.tokenValue += char;
                } else {
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

        tokens.forEach((t,i)=>{
            t.tokenValue && (t.tokenValue=t.tokenValue.trim());
            if (charInArr(t.tokenValue,Token.KEY_WORDS)) t.tokenType = Token.KEY_WORDS;

            if (t && t.tokenType==Token.TYPE.VARIABLE) {
                let next = tokens[i+1];
                if (next && (next.tokenValue == Token.SYMBOL.COLON))
                    t.tokenType = Token.TYPE.OBJECT_KEY;
                if (t.tokenValue && t.tokenValue.startsWith('.'))
                    t.tokenType = Token.TYPE.STRING; // resolve expression error at app.task.taskCases[0].text
            }

        });
        if (!isEndWithSemicolon) tokens.pop();
        //console.log(JSON.stringify(tokens));
        return tokens;
    }

    static convertExpression(expression,variableReplacerStr = '{expr}'){
        let out = '';
        expression = expression.split('\n').join('');
        Lexer.tokenize(expression).forEach(function(token){
            if ([
                    Token.TYPE.VARIABLE,
                    Token.TYPE.FUNCTION
                ].indexOf(token.tokenType)>-1) {
               out+=variableReplacerStr.replace('{expr}',token.tokenValue);
            }
            else out+=(token.tokenValue||token.tokenType);
        });
        return out;
    }

}