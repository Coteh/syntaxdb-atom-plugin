'use babel';

import { TextEditor } from 'atom';
import { $, View, TextEditorView } from 'atom-space-pen-views';
import { CompositeDisposable, Emitter } from 'atom';

export default class SyntaxSearchView extends View {
    static content() {
        const searchBarEditor = new TextEditor({ mini: true });

        this.div({ class: 'search-bar' }, () => {
            this.label({ outlet: 'searchLabel' });
            this.subview(
                'searchBarEditorView',
                new TextEditorView({ editor: searchBarEditor }),
            );
            // this.button({class: "btn btn-primary inline-block-tight", outlet: 'searchBtn'});
        });
    }

    constructor(serializedState) {
        super(serializedState);

        // Create message element
        const dialogDiv = document.createElement('div');
        dialogDiv.classList.add('block');
        this.element.appendChild(dialogDiv);

        this.cancelling = false;

        this.eventEmitter = new Emitter();

        this.addClass('syntaxdb-search');
    }

    initialize() {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(
            atom.commands.add(this.element, {
                'core:confirm': (e) => this.confirmSearch(),
                'core:cancel': (e) => {
                    this.cancel();
                    e.stopPropagation();
                },
            }),
        );

        //on 'blur' events (such as tab key press)
        this.searchBarEditorView.on('blur', (e) => {
            //cancel out if it's not currently cancelling and document has focus
            if (!this.cancelling && document.hasFocus()) {
                this.cancel();
            }
        });

        this.panel = atom.workspace.addModalPanel({
            item: this.getElement(),
            visible: false,
        });
    }

    showPanel() {
        this.panel.show();
    }

    hidePanel() {
        this.panel.hide();
    }

    isPanelVisible() {
        return this.panel.isVisible();
    }

    /*
     * Puts the search box into focus
     */
    focus() {
        this.searchBarEditorView.focus();
    }

    clearSearchText() {
        this.searchBarEditorView.setText('');
    }

    confirmSearch() {
        var searchText = this.searchBarEditorView.getText();
        if (searchText) {
            this.confirmed(searchText);
        } else {
            this.cancel();
        }
    }

    confirmed(searchText) {
        this.eventEmitter.emit('did-confirm-search', {
            searchText: searchText,
        });
    }

    cancel() {
        console.trace();
        this.cancelling = true;
        this.clearSearchText();
        this.eventEmitter.emit('did-cancel');
        this.restoreFocus();
        this.cancelling = false;
    }

    /*
     * Stores the previously focused element
     * so it can be refocused once view closes
     */
    storeFocusedElement() {
        this.prevFocused = $(document.activeElement);
    }

    restoreFocus() {
        console.log(this.prevFocused);
        if (this.prevFocused && this.searchBarEditorView.hasFocus()) {
            this.prevFocused.focus();
        }
    }

    setConfirmAction(callback) {
        if (this.confirmEvent) {
            this.confirmEvent.dispose();
        }
        this.confirmEvent = this.eventEmitter.on(
            'did-confirm-search',
            callback,
        );
    }

    setCancelAction(callback) {
        if (this.cancelEvent) {
            this.cancelEvent.dispose();
            // console.log("Unsubbed");
        }
        this.cancelEvent = this.eventEmitter.on('did-cancel', callback);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.subscriptions.dispose();
        this.eventEmitter.dispose();
        this.panel.destroy();
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    setLabelMessage(message) {
        this.searchLabel.css('color', '');
        this.searchLabel.text(message);
    }

    setErrorMessage(message) {
        this.searchLabel.css({
            color: 'red',
        });
        this.searchLabel.text(message);
    }
}
