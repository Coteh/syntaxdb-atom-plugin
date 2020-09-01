'use babel';

export default class ResultsPresenter {
    constructor(result) {
        this.result = result;
    }

    showResults(resultView) {
        if (!this.result) {
            console.error('No result to present.');
            return;
        }
        if (!resultView) {
            console.error('No result view provided.');
            return;
        }

        this.resultView = resultView;

        this.resultView.setDescription(this.result.item.description);
        this.resultView.setNotesText(this.result.item.notes);
        this.resultView.setSyntaxText(this.result.item.syntax);
        this.resultView.setExampleText(this.result.item.example);
        this.resultView.setDocumentationText(this.result.item.documentation);

        var _this = this;
        this.resultView.setCancelAction(function () {
            _this.hideResults();
        });

        this.resultView.storeFocusedElement();
        this.resultView.firstTab();
        this.resultView.panel.show();
        this.resultView.focus();
    }

    hideResults() {
        if (!this.result) {
            console.error('No result to hide.');
            return;
        }
        if (!this.resultView) {
            console.error('No result view in this presenter.');
            return;
        }
        this.resultView.panel.hide();
        //Call on hide actions
        this.resultView.onHide();
        this.resultView.restoreFocus();
    }
}
