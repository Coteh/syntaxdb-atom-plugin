'use babel';

let reservedMap = new Map([
    ['!', 1],
    ['#', 1],
    ['$', 1],
    ['&', 1],
    ['\'', 1],
    ['(', 1],
    [')', 1],
    ['*', 1],
    ['+', 1],
    [',', 1],
    [':', 1],
    [';', 1],
    ['=', 1],
    ['?', 1],
    ['@', 1],
    ['[', 1],
    [']', 1],
    ['%', 1],
]);

export default class PercentEncoder {
    static percentEncodeChar(char) {
        return "%" + char.charCodeAt(0).toString(16);
    }
    static percentEncodeStr(str) {
        var result = "";

        for (var i = 0; i < str.length; i++) {
            result += (this.isReservedChar(str[i])) ? this.percentEncodeChar(str[i]) : str[i];
        }

        return result;
    }
    static isReservedChar(char) {
        return reservedMap.has(char);
    }
}
