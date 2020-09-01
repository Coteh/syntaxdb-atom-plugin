'use babel';

import { $, View } from 'atom-space-pen-views';

export default class SyntaxResultTab extends View {
    constructor(serializedState) {
        super(serializedState);
    }

    // Overridden by child classes to return the element of main focus for the tab
    getFocusElement() {}

    // Focuses the element of main focus for the tab
    focus() {
        this.getFocusElement().focus();
    }

    // Overridden by child classes to define setting text behavour for child tab class.
    setText(text) {}

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Callback for tab-related actions once it shows up on the panel.
    onShow() {
        var _this = this;
        $(this.getElement()).on('click', (e) => {
            _this.focus();
            e.stopImmediatePropagation();
        });
    }

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }
}
