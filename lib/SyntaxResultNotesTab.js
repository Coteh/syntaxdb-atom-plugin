'use babel';

import SyntaxResultTab from './SyntaxResultTab';
import SyntaxCSS from './SyntaxCSS';
import { TextEditor } from 'atom';
import { TextEditorView } from 'atom-space-pen-views';

export default class SyntaxResultNotesTab extends SyntaxResultTab {
    static content() {
        const focusEditor = new TextEditor({ mini: true });

        this.div({ class: 'results-tab' }, () => {
            this.label({ outlet: 'notesLabel' });
            this.subview(
                'focusEditorView',
                new TextEditorView({ editor: focusEditor }),
            );
        });
    }

    constructor(serializedState) {
        super(serializedState);

        this.focusEditorView.css(SyntaxCSS.invisibleFocusElement());

        this.focusEditorView.addClass('syntaxdb-result-editor');
    }

    getFocusElement() {
        return this.focusEditorView;
    }

    setText(text) {
        this.notesLabel.text(text);
    }
}
