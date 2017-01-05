'use babel';

export default class PercentEncoder {
    static percentEncodeChar(char) {
        return "%" + char.charCodeAt(0).toString(16);
    }
    static percentEncodeStr(str) {
        var result = "";

        for (var i = 0; i < str.length; i++) {
            result += this.percentEncodeChar(str[i]);
        }

        return result;
    }
}
