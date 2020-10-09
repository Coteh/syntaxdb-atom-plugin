'use babel';

import SyntaxResultTab from './SyntaxResultTab';
import EditorInserter, {
    EmptyInsertionTextError,
    MissingEditorError,
} from '../../editor/EditorInserter';
import KeybindFinder from '../../editor/KeybindFinder';
import NewLine from '../../util/NewLine';
import { TextEditor } from 'atom';
import { TextEditorView } from 'atom-space-pen-views';
import { CompositeDisposable } from 'atom';

export default class SyntaxResultExampleTab extends SyntaxResultTab {
    static content() {
        const resultEditor = new TextEditor({ mini: false });

        let placeShortcutTxt = '???';
        let keybindFinder = new KeybindFinder(
            'syntaxdb-atom-plugin:place-example',
        );
        let placeShortcutBind = keybindFinder.findFirstBinding();
        if (placeShortcutBind) {
            placeShortcutTxt = placeShortcutBind.keystrokes;
        }

        this.div({ class: 'results-tab' }, () => {
            this.subview(
                'resultEditorView',
                new TextEditorView({ editor: resultEditor }),
            );
            this.button('Place in Document (' + placeShortcutTxt + ')', {
                class: 'btn btn-primary inline-block-tight',
                outlet: 'placeBtn',
            });
        });
    }

    constructor(serializedState) {
        super(serializedState);

        this.editorInserter = new EditorInserter(
            atom.workspace.getActiveTextEditor(),
        );

        this.resultEditorView.addClass('syntaxdb-result-editor');
    }

    initialize() {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(
            atom.commands.add(this.element, {
                'syntaxdb-atom-plugin:place-example': (e) => {
                    this.onPlaceButtonClick();
                    e.stopPropagation();
                },
            }),
        );
    }

    getFocusElement() {
        return this.resultEditorView;
    }

    setText(text) {
        this.resultEditorView.setText(NewLine.newLineizeEditorText(text));
    }

    onShow() {
        super.onShow();
        this.placeBtn.on('click', () => {
            this.onPlaceButtonClick();
        });
    }

    onPlaceButtonClick() {
        try {
            this.editorInserter.insertText(this.resultEditorView.getText());
        } catch (e) {
            if (e instanceof EmptyInsertionTextError) {
                console.error('No text to insert.');
            } else if (e instanceof MissingEditorError) {
                console.error('No editor to insert into.');
            } else {
                console.error('Unknown error.');
            }
        }
    }
}
