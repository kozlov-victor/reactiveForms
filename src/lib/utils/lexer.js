
class Token {
    constructor(type,val){
        this.tokenType = type;
        this.tokenValue = val;
    }
}

Token.SPECIAL_CHARS =
    '.(){}[],+*-/><=?:';

Token.TOKEN_TYPE = {
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
        expression.split('').forEach(function(char,i){

            switch (char) {
                case Token.TOKEN_TYPE.L_PAR:
                case Token.TOKEN_TYPE.R_PAR:
                case Token.TOKEN_TYPE.PLUS:
                case Token.TOKEN_TYPE.L_CURLY:
                case Token.TOKEN_TYPE.R_CURLY:
                case Token.TOKEN_TYPE.L_SQUARE:
                case Token.TOKEN_TYPE.R_SQUARE:
                case Token.TOKEN_TYPE.COMMA:
                case Token.TOKEN_TYPE.MINUS:
                case Token.TOKEN_TYPE.DIVIDE:
                case Token.TOKEN_TYPE.MULTIPLY:
                case Token.TOKEN_TYPE.LT:
                case Token.TOKEN_TYPE.GT:
                case Token.TOKEN_TYPE.COLON:
                case Token.TOKEN_TYPE.QUESTION:
                case Token.TOKEN_TYPE.EQUAL:
                    t = new Token(char,null);
                    tokens.push(t);
                    lastChar = char;
                    break;
                default:
                    let last = tokens[tokens.length-1];
                    if (last && last.tokenType!=Token.TOKEN_TYPE.STRING && char==' ') break;
                    if (
                        last &&
                        (
                            last.tokenType==Token.TOKEN_TYPE.DIGIT ||
                            last.tokenType==Token.TOKEN_TYPE.VARIABLE ||
                            last.tokenType==Token.TOKEN_TYPE.OBJECT_KEY ||
                            last.tokenType==Token.TOKEN_TYPE.STRING)
                    ) {
                        last.tokenValue+=char;
                    } else {
                        let type;
                        if(isNumber(char)) type = Token.TOKEN_TYPE.DIGIT;
                        else if (charInArr(char,['"',"'"])) type = Token.TOKEN_TYPE.STRING;
                        else if (
                            lastChar==Token.TOKEN_TYPE.L_CURLY ||
                            lastChar==Token.TOKEN_TYPE.COMMA
                        ) type = Token.TOKEN_TYPE.OBJECT_KEY;
                        else type = Token.TOKEN_TYPE.VARIABLE;
                        t = new Token(type,char);
                        tokens.push(t);
                    }
                    lastChar = char;
                    break;
            }
        });
        //console.log(JSON.stringify(tokens));
        return tokens;
    }

    static convertExpression(expression,variableReplacerStr){
        let out = '';
        Lexer.tokenize(expression).forEach(function(token){
            if (token.tokenType==Token.TOKEN_TYPE.VARIABLE) {
               out+=variableReplacerStr.replace('{expr}',token.tokenValue);
            }
            else out+=(token.tokenValue||token.tokenType);
        });
        return out;
    }

}

Lexer.convertExpression("invokeFn()",'scope.{expr}');