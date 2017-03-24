
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
    COLON:':'
};

Token.ALL_SYMBOLS = Object.keys(Token.SYMBOL).map(key=>{return Token.SYMBOL[key]});

Token.TYPE = {
    DIGIT:'DIGIT',
    VARIABLE:'VARIABLE',
    STRING:'STRING',
    OBJECT_KEY:'OBJECT_KEY'
};

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function charInArr(char,arr) {
    return arr.indexOf(char)>-1;
}

class Lexer {

    static tokenize(expression) {
        let tokens = [], t, lastChar = '';
        expression = expression.trim();
        expression.split('').forEach(function(char,i) {

            if (charInArr(char, Token.ALL_SYMBOLS)) {
                t = new Token(char, null);
                tokens.push(t);
                lastChar = char;
            } else {
                let lastToken = tokens[tokens.length - 1];
                if (lastToken && lastToken.tokenType != Token.TYPE.STRING && char == ' ') return;
                if (
                    lastToken &&
                    (
                        lastToken.tokenType == Token.TYPE.DIGIT ||
                        lastToken.tokenType == Token.TYPE.VARIABLE ||
                        lastToken.tokenType == Token.TYPE.OBJECT_KEY ||
                        lastToken.tokenType == Token.TYPE.STRING
                    )
                ) {
                    lastToken.tokenValue += char;
                } else {
                    let type;
                    if(isNumber(char)) type = Token.TYPE.DIGIT;
                    else if (charInArr(char,['"',"'"])) type = Token.TYPE.STRING;
                    else if (
                        lastChar==Token.SYMBOL.L_CURLY ||
                        lastChar==Token.SYMBOL.COMMA
                    ) type = Token.TYPE.OBJECT_KEY;
                    else type = Token.TYPE.VARIABLE;
                    t = new Token(type,char);
                    tokens.push(t);
                }
                lastChar = char;
            }
        });

        tokens.forEach(t=>{
            t.tokenValue && (t.tokenValue=t.tokenValue.trim());
        });
        //console.log(JSON.stringify(tokens));
        return tokens;
    }

    static convertExpression(expression,variableReplacerStr){
        let out = '';
        expression = expression.split('\n').join('');
        Lexer.tokenize(expression).forEach(function(token){
            if (token.tokenType==Token.TYPE.VARIABLE) {
               out+=variableReplacerStr.replace('{expr}',token.tokenValue);
            }
            else out+=(token.tokenValue||token.tokenType);
        });
        return out;
    }

}