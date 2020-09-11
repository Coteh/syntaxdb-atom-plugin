'use babel';

export class InvalidPercentEncodedStringError extends Error {}

let reservedMap = new Map([
    ['!', 1],
    ['#', 1],
    ['$', 1],
    ['&', 1],
    ["'", 1],
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

export function percentEncode(str) {
    if (str == null) {
        throw new InvalidPercentEncodedStringError(
            'String to be encoded is null or undefined',
        );
    }

    var result = '';

    for (let i = 0; i < str.length; i++) {
        result += reservedMap.has(str[i])
            ? '%' + str[i].charCodeAt(0).toString(16)
            : str[i];
    }

    return result;
}
