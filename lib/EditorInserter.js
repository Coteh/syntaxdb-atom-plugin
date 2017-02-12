'use babel';

import { TextEditor } from 'atom';

export default class EditorInserter {
    setText(text) {
        this.insertionText = text;
    }

    performInsertion() {
        //Make sure there's actually text to insert before continuing
        if (!this.insertionText) {
            console.error("No text to insert.");
            return;
        }
        //Get the active text editor
        var textEditor = atom.workspace.getActiveTextEditor();
        if (textEditor === undefined) {
            console.error("Cannot find active text editor.");
            return;
        }
        //Get all current selections
        var selections = textEditor.getSelections();
        //Perform an insertion for each selection taking into account its own tabbing
        for (let i = 0; i < selections.length; i++) {
            //Break up lines
            var lines = this.insertionText.split("\n");
            //Go back to the very beginning of the line and save the tab spacing
            selections[i].selectToBeginningOfLine();
            var selectedText = selections[i].getText();
            var tabSpacing = "";
            for (let j = 0; j < selectedText.length; j++) {
                //Stop collecting tab characters when the first non-(hard/soft)tab character is reached
                if (selectedText[j] != "\t" && selectedText[j] != " ") {
                    break;
                }
                tabSpacing += selectedText[j];
            }
            //Place selection back to where it was initially
            selections[i].selectRight(selectedText.length);
            //Start by inserting the first line
            selections[i].insertText(lines[0]);
            //Now prepend this tab spacing to all other lines and concatenate them
            var concatenation = "";
            for (let j = 1; j < lines.length; j++) {
                concatenation += tabSpacing + lines[j];
            }
            //Finally, insert this concatenation to complete the insertion
            selections[i].insertText(concatenation);
        }
    }
}
