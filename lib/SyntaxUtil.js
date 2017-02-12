'use babel';

export default class SyntaxUtil {
    static newLineizeEditorText(text) {
        if (text[text.length - 1] != '\n') {
            return text + "\n";
        }
        return text;
    }
}
