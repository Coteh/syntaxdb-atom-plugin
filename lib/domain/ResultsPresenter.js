'use babel';

export default class ResultsPresenter {
    showResults(results, resultView) {
        if (!results) {
            console.error('No result to present.');
            return;
        }
        if (!resultView) {
            console.error('No result view provided.');
            return;
        }

        this.resultView = resultView;

        this.resultView.setDescription(results.item.description);
        this.resultView.setNotesText(results.item.notes);
        this.resultView.setSyntaxText(results.item.syntax);
        this.resultView.setExampleText(results.item.example);
        this.resultView.setDocumentationText(results.item.documentation);

        this.results = results;

        var _this = this;
        this.resultView.setCancelAction(function () {
            _this.hideResults();
        });

        this.resultView.storeFocusedElement();
        this.resultView.firstTab();
        this.resultView.showPanel();
        this.resultView.focus();
    }

    hideResults() {
        if (!this.results) {
            console.error('No result to hide.');
            return;
        }
        if (!this.resultView) {
            console.error('No result view in this presenter.');
            return;
        }
        this.resultView.hidePanel();
        //Call on hide actions
        this.resultView.onHide();
        this.resultView.restoreFocus();
    }
}
