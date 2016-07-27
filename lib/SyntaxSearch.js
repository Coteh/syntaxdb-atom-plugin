'use babel';

import SyntaxModel from './SyntaxModel';
import ResultsPresenter from "./ResultsPresenter";
import { LanguageFilterMode } from './SyntaxModes';

export default class SyntaxSearch extends SyntaxModel {
    setViews(views) {
        if (!views) {
            return;
        }
        if (views.filterView) {
            this.filterView = views.filterView;
        }
        if (views.searchView) {
            this.searchView = views.searchView;
        }
        if (views.resultView) {
            this.resultView = views.resultView;
        }
    }

    showSearch() {
        if (this.searchView) {
            (function(_this) {
                _this.searchView.setConfirmAction(function(result){
                    _this.performSearch(result);
                });
                _this.searchView.setCancelAction(function(){
                    _this.hideSearch();
                });
            })(this);
            this.searchView.panel.show();
            this.searchView.storeFocusedElement();
            this.searchView.focus();
        } else {
            console.err("ERROR: No search view provided");
        }
    }

    hideSearch() {
        if (this.searchView) {
            this.searchView.panel.hide();
        } else {
            console.err("ERROR: No search view provided");
        }
    }

    toggleSearch() {
        if (this.searchView && this.searchView.panel.isVisible()) {
            this.hideSearch();
        } else if (this.filterView && this.filterView.panel.isVisible()) {
            this.hideSearchResults();
        } else if (this.resultView && this.resultView.panel.isVisible()) {
            this.hideResultView();
        } else {
            this.showSearch();
        }
    }

    performSearch(result) {
        var _this = this;
        request("http://syntaxdb.com/api/v1/concepts/search?q=" + result.searchText, function(error, response, body){
            results = JSON.parse(body);
            _this.onRequestReceived(results, {searchQuery: result.searchText, show: true});
        });
    }

    showSearchResults() {
        if (this.filterView) {
            var _this = this;
            this.filterView.setConfirmAction(function(result){
                _this.filterView.restoreFocus();
                if (result && result.item) {
                    _this.resultsPresenter = new ResultsPresenter(result);
                    _this.resultsPresenter.showResults(_this.resultView);
                }
            });
            this.filterView.setCancelAction(function(){
                _this.hideSearchResults();
            });
            this.filterView.setLabelMessage("Search Results for \"" + this.lastQuery + "\":");
            this.searchView.restoreFocus();
            this.filterView.storeFocusedElement();
            this.filterView.panel.show();
            this.filterView.focusFilterEditor();
        } else {
            console.err("ERROR: No filter view provided");
        }
    }

    hideSearchResults() {
        this.filterView.panel.hide();
        this.filterView.restoreFocus();
    }

    onCancel() {
        if (this.searchView && this.searchView.panel.isVisible()) {
            this.hideSearch();
        } else if (this.filterView && this.filterView.panel.isVisible()) {
            this.hideSearchResults();
        } else if (this.resultView && this.resultView.panel.isVisible()) {
            this.hideResultView();
        }
    }

    onRequestReceived(results, options) {
        this.lastQuery = options.searchQuery;
        if (this.filterView) {
            //Give results to the filter
            this.filterView.setItems(results);
            //Change filter display mode to display concepts
            this.filterView.changeMode(LanguageFilterMode.SELECT_CONCEPT);
            //If show option flag set, show the results
            if (options && options.show) {
                this.showSearchResults();
            }
        }
    }
}
