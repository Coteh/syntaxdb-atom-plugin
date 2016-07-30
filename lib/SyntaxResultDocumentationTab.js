'use babel';

import SyntaxResultTab from "./SyntaxResultTab"
import open from "open";
import { TextEditor } from 'atom';
import { $, TextEditorView } from 'atom-space-pen-views';

export default class SyntaxResultDocumentationTab extends SyntaxResultTab {
    static content() {
        const focusEditor = new TextEditor({mini: true});

        this.div({class: "results-tab"}, () => {
            this.ol({outlet: "documentationList"});
            this.subview('focusEditorView', new TextEditorView({editor: focusEditor}));
        });
    }

    constructor(serializedState) {
        super(serializedState);

        this.focusEditorView.css({
            position: "absolute",
            top: "-100px"
        });

        this.focusEditorView.addClass("syntaxdb-result-editor");
    }

    getFocusElement() {
        return this.focusEditorView;
    }

    setText(text) {
        if (!text || text == "") {
            console.warn("No text provided to add to documentation list.");
            return;
        }
        var newListElement = $("<li>" + text + "</li>");
        var urlElement = $("a", newListElement);
        var url = urlElement.attr("href");
        urlElement.removeAttr("href");
        if (typeof(url) == "string" && url.indexOf("http") >= 0) {
            urlElement.on("click", () => {
                open(url, null, (error) => {
                    if (error) {
                        console.log(error);
                    }
                });
            });
        }
        this.documentationList.append(newListElement);
    }

    removeAllEntries() {
        this.documentationList.empty();
    }
}
