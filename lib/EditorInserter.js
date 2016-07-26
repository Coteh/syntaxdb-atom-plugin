'use babel';

import { TextEditor } from 'atom';

export default class EditorInserter {
    setText(text) {
        this.insertionText = text;
    }

    performInsertion() {
        if (!this.insertionText) {
            console.error("No text to insert.");
            return;
        }
        this.textEditor = atom.workspace.getActiveTextEditor();
        this.textEditor.insertText(this.insertionText);
    }
}
