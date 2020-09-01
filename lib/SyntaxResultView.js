'use babel';

import { TextEditor } from 'atom';
import { $, View, TextEditorView } from 'atom-space-pen-views';
import { CompositeDisposable, Emitter } from 'atom';
import KeybindFinder from './KeybindFinder';

export default class SyntaxResultView extends View {
    static content() {
        let nextShortcutTxt = '???';
        let prevShortcutTxt = '???';
        let keybindFinder = new KeybindFinder('syntaxdb-atom-plugin:next-tab');
        let nextShortcutBind = keybindFinder.findFirstBinding();
        if (nextShortcutBind) {
            nextShortcutTxt = nextShortcutBind.keystrokes;
        }
        keybindFinder = new KeybindFinder('syntaxdb-atom-plugin:prev-tab');
        let prevShortcutBind = keybindFinder.findFirstBinding();
        if (prevShortcutBind) {
            prevShortcutTxt = prevShortcutBind.keystrokes;
        }

        this.div({ class: 'results-pane' }, () => {
            this.label({ outlet: 'resultLabel' });
            this.div({ class: 'block' }, () => {
                this.div({ class: 'btn-group', outlet: 'tabDiv' });
            });
            this.div({ outlet: 'howtoDiv' }, () => {
                this.label(nextShortcutTxt + ': Next tab');
                this.br();
                this.label(prevShortcutTxt + ': Prev tab');
            });
        });
    }

    constructor(serializedState) {
        super(serializedState);

        this.tabsList = [];

        this.eventEmitter = new Emitter();

        this.addClass('syntaxdb-result');
    }

    initialize() {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(
            atom.commands.add(this.element, {
                'syntaxdb-atom-plugin:next-tab': (e) => {
                    this.nextTab();
                    e.stopPropagation();
                },
                'syntaxdb-atom-plugin:prev-tab': (e) => {
                    this.prevTab();
                    e.stopPropagation();
                },
                'core:cancel': (e) => {
                    this.cancelled();
                    e.stopPropagation();
                },
            }),
        );

        // Register itself as a panel on atom's workspace
        this.panel = atom.workspace.addModalPanel({
            item: this.getElement(),
            visible: false,
        });
    }

    addTabs(tabs) {
        var _this = this;
        tabs.forEach(function (item, index, array) {
            //Required properties
            if (!item.name || !item.tab) {
                //TODO
                //Throw error here
                console.error('Required property for tab not set.');
                return;
            }
            var newBtn = $('<button class="btn">' + item.name + '</button>');
            item.button = newBtn;
            item.index = index;
            _this.tabsList.push(item);
            _this.tabDiv.append(newBtn);
            newBtn.on('click', () => {
                _this.switchTab(item.name);
            });
        });
    }

    getTab(tabName) {
        var foundTabObj = this.getTabObj(tabName);
        if (foundTabObj) {
            return foundTabObj.tab;
        }
        return null;
    }

    switchTab(tabName) {
        //Remove previous tab
        this.hideTab(this.currTab);
        //Display the new tab
        this.displayTab(this.getTabObj(tabName));
        //Put the tab into focus
        this.currTab.tab.focus();
    }

    firstTab() {
        if (this.tabsList.length > 0) this.displayTab(this.tabsList[0]);
    }

    nextTab() {
        var tabIndex = 0;
        if (this.currTab) {
            tabIndex = (this.currTab.index + 1) % this.tabsList.length;
            this.hideTab(this.currTab);
        }
        if (this.tabsList.length > 0) {
            this.displayTab(this.tabsList[tabIndex]);
            //Put the tab into focus
            this.currTab.tab.focus();
        }
    }

    prevTab() {
        var tabIndex = 0;
        if (this.currTab) {
            tabIndex = this.currTab.index - 1;
            if (tabIndex < 0) {
                tabIndex = this.tabsList.length - 1;
            }
            this.hideTab(this.currTab);
        }
        if (this.tabsList.length > 0) {
            this.displayTab(this.tabsList[tabIndex]);
            //Put the tab into focus
            this.currTab.tab.focus();
        }
    }

    /*
     * Puts the current tab into focus
     */
    focus() {
        if (this.currTab) {
            this.currTab.tab.focus();
        }
    }

    cancelled() {
        //Call cancel event
        this.eventEmitter.emit('did-cancel');
    }

    setDescription(text) {
        this.resultLabel.text(text);
    }

    setNotesText(text) {
        var notesTab = this.getTab('Notes');
        if (!notesTab) {
            //TODO
            //Throw no notes tab error
            console.error('No notes tab');
        }
        notesTab.setText(text);
    }

    setSyntaxText(text) {
        var syntaxTab = this.getTab('Syntax');
        if (!syntaxTab) {
            //TODO
            //Throw no syntax tab error
            console.error('No syntax tab');
        }
        syntaxTab.setText(text);
    }

    setExampleText(text) {
        var exampleTab = this.getTab('Example');
        if (!exampleTab) {
            //TODO
            //Throw no syntax tab error
            console.error('No example tab');
        }
        exampleTab.setText(text);
    }

    setDocumentationText(text) {
        var documentationTab = this.getTab('Documentation');
        if (!documentationTab) {
            //TODO
            //Throw no documentation tab error
            console.error('No documentation tab');
        }
        documentationTab.setText(text);
    }

    /*
     * Stores the previously focused element
     * so it can be refocused once view closes
     */
    storeFocusedElement() {
        this.prevFocused = $(document.activeElement);
        console.log(this.prevFocused);
    }

    restoreFocus() {
        if (this.prevFocused) {
            this.prevFocused.focus();
        }
    }

    // setConfirmAction(callback) {
    //     this.eventEmitter.on('place-example', callback);
    // }

    setCancelAction(callback) {
        if (this.cancelEvent) {
            this.cancelEvent.dispose();
        }
        this.cancelEvent = this.eventEmitter.on('did-cancel', callback);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    onHide() {
        //Hide the current tab
        this.hideTab(this.currTab);
        //Remove all list elements in documentation tab
        var documentationTab = this.getTab('Documentation');
        if (documentationTab) {
            documentationTab.removeAllEntries();
        }
    }

    /***
    Private
    ***/

    getTabObj(tabName) {
        var foundTabObj = null;
        this.tabsList.forEach(function (item, index, array) {
            if (item.name == tabName) {
                foundTabObj = item;
            }
        });
        return foundTabObj;
    }

    hideTab(tabObj) {
        if (tabObj) {
            tabObj.tab.remove();
            tabObj.button.removeClass('selected');
            this.currTab = null;
        }
    }

    displayTab(tabObj) {
        if (tabObj) {
            tabObj.tab.insertBefore(this.howtoDiv);
            tabObj.tab.onShow();
            tabObj.button.addClass('selected');
            this.currTab = tabObj;
        }
    }
}
