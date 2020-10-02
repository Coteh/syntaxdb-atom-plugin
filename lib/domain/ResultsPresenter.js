'use babel';

export default class ResultsPresenter {
    showResults(results, resultView) {
        if (!results) {
            throw new Error('No result to present');
        }
        if (!resultView) {
            throw new Error('No result view provided');
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
        if (!this.resultView) {
            throw new Error('No result view in this presenter');
        }
        this.resultView.hidePanel();
        //Call on hide actions
        this.resultView.onHide();
        this.resultView.restoreFocus();
    }
}
