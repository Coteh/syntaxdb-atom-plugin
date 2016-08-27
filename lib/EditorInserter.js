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
        //Break up lines
        var lines = this.insertionText.split("\n");
        //Start by inserting the first line
        this.textEditor.insertText(lines[0]);
        //Go back to the very beginning of the line and save the tab spacing
        var tabSpacing = "      ";
        //Now prepend this tab spacing to all other lines and concatenate them
        var concatenation = "";
        for (let i = 1; i < lines.length; i++) {
            concatenation += tabSpacing + lines[i];
        }
        //Finally, insert this concatenation to complete the insertion
        this.textEditor.insertText(concatenation);
    }
}
