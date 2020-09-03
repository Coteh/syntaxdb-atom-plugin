'use babel';

AtomSpacePenViews = require('atom-space-pen-views');
SelectListView = AtomSpacePenViews.SelectListView;
import { LanguageFilterMode } from '../domain/SyntaxModes';
import SyntaxCSS from './style/SyntaxCSS';
import { Emitter } from 'atom';

export default class SyntaxFilterView extends SelectListView {
    constructor(serializedState) {
        super(serializedState);

        // Create a new event emitter instance
        this.eventEmitter = new Emitter();

        // Create message element
        const dialogDiv = document.createElement('div');
        dialogDiv.classList.add('block');
        this.element.insertBefore(dialogDiv, this.element.firstChild);

        // Create input element
        this.searchLabel = document.createElement('label');
        dialogDiv.appendChild(this.searchLabel);

        // Add a unique class for this element
        this.addClass('syntaxdb-filter');
    }

    initialize() {
        super.initialize();

        // Register itself as a panel on atom's workspace
        this.panel = atom.workspace.addModalPanel({
            item: this.getElement(),
            visible: false,
        });
    }

    setItems(items) {
        super.setItems(items);
        //If no items provided
        if (items.length == 0) {
            //then "hide" the filter text editor, but keep
            //it visible so we can still close the panel with ESC key
            this.filterEditorView.css(SyntaxCSS.invisibleFocusElement());
        } else {
            //otherwise, set it to "visible" (aka put it in a position where we can see it)
            this.filterEditorView.css(SyntaxCSS.visibleFocusElement());
        }
    }

    viewForItem(item) {
        switch (this.currentMode) {
            case LanguageFilterMode.SELECT_CATEGORY:
                return '<li>' + item.category_name + '</li>';
            case LanguageFilterMode.SELECT_CONCEPT:
                return (
                    '<li>' +
                    item.concept_name +
                    '</br>' +
                    item.language_permalink +
                    '</li>'
                );
            case LanguageFilterMode.SELECT_LANGUAGE:
            default:
                return '<li>' + item.language_permalink + '</li>';
        }
    }

    confirmed(item) {
        this.eventEmitter.emit('did-confirm-item', {
            mode: this.currentMode,
            item: item,
        });
        return item;
    }

    cancel() {
        console.log('cancel event');
        super.cancel();
        this.eventEmitter.emit('did-cancel');
    }

    getFilterKey() {
        switch (this.currentMode) {
            case LanguageFilterMode.SELECT_CATEGORY:
                return 'category_name';
            case LanguageFilterMode.SELECT_CONCEPT:
                return 'concept_name';
            case LanguageFilterMode.SELECT_LANGUAGE:
            default:
                return 'language_permalink';
        }
    }

    setConfirmAction(callback) {
        if (this.confirmEvent) {
            this.confirmEvent.dispose();
        }
        this.confirmEvent = this.eventEmitter.on('did-confirm-item', callback);
    }

    setCancelAction(callback) {
        if (this.cancelEvent) {
            this.cancelEvent.dispose();
        }
        this.cancelEvent = this.eventEmitter.on('did-cancel', callback);
    }

    changeMode(mode) {
        this.currentMode = mode;
        this.filterEditorView.setText('');
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.eventEmitter.dispose();
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    setLabelMessage(message) {
        this.searchLabel.textContent = message;
    }
}
