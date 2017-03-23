//
// class Token {
//     constructor(type,val){
//         this.tokenType = type;
//         this.tokenValue = val;
//     }
// }
//
// Token.SPECIAL_CHARS =
//     '.(){}[],+*-/%!><=?:'.split('');
//
// Token.TOKEN_TYPE = {
//     DIGIT:'DIGIT',
//     VARIABLE:'VARIABLE',
//     STRING:'STRING',
//     OBJECT_KEY:'OBJECT_KEY'
// };
//
// function isNumber(n) {
//     return !isNaN(parseFloat(n)) && isFinite(n);
// }
//
// function charInArr(char,arr) {
//     return arr.indexOf(char)>-1;
// }
//
// class Lexer {
//
//     static tokenize(expression) {
//         let tokens = [], t, lastChar = '';
//         expression = expression.trim();
//         expression.split('').forEach(function(char,i) {
//
//             if (charInArr(char, Token.SPECIAL_CHARS)) {
//                 t = new Token(char, null);
//                 tokens.push(t);
//                 lastChar = char;
//             } else {
//                 let last = tokens[tokens.length - 1];
//                 if (last && last.tokenType != Token.TOKEN_TYPE.STRING && char == ' ') return;
//                 if (
//                     last &&
//                     (
//                     last.tokenType == Token.TOKEN_TYPE.DIGIT ||
//                     last.tokenType == Token.TOKEN_TYPE.VARIABLE ||
//                     last.tokenType == Token.TOKEN_TYPE.OBJECT_KEY ||
//                     last.tokenType == Token.TOKEN_TYPE.STRING)
//                 ) {
//                     last.tokenValue += char;
//                 } else {
//                     let type;
//                     if (isNumber(char)) type = Token.TOKEN_TYPE.DIGIT;
//                     else if (charInArr(char, ['"', "'"])) type = Token.TOKEN_TYPE.STRING;
//                     else if (charInArr(lastChar,[',','{'])) type = Token.TOKEN_TYPE.OBJECT_KEY;
//                     else type = Token.TOKEN_TYPE.VARIABLE;
//                     t = new Token(type, char);
//                     tokens.push(t);
//                 }
//                 lastChar = char;
//             }
//         });
//         //console.log(JSON.stringify(tokens));
//         return tokens;
//     }
//
//     static convertExpression(expression,variableReplacerStr){
//         let out = '';
//         Lexer.tokenize(expression).forEach(function(token){
//             if (token.tokenType==Token.TOKEN_TYPE.VARIABLE) {
//                 out+=variableReplacerStr.replace('{expr}',token.tokenValue);
//             }
//             else out+=(token.tokenValue||token.tokenType);
//         });
//         return out;
//     }
//
// }

//Lexer.convertExpression("{red:appClass=='red',green:appClass=='green'}");