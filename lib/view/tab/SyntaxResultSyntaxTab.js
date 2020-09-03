'use babel';

import SyntaxResultTab from './SyntaxResultTab';
import NewLine from '../../util/NewLine';
import { TextEditor } from 'atom';
import { TextEditorView } from 'atom-space-pen-views';

export default class SyntaxResultSyntaxTab extends SyntaxResultTab {
    static content() {
        const resultEditor = new TextEditor({ mini: false });

        this.div({ class: 'results-tab' }, () => {
            this.subview(
                'resultEditorView',
                new TextEditorView({ editor: resultEditor }),
            );
        });
    }

    constructor(serializedState) {
        super(serializedState);

        this.resultEditorView.addClass('syntaxdb-result-editor');
    }

    getFocusElement() {
        return this.resultEditorView;
    }

    setText(text) {
        this.resultEditorView.setText(NewLine.newLineizeEditorText(text));
    }
}
