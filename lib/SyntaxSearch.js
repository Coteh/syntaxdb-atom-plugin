'use babel';

import SyntaxModel from './SyntaxModel';
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
                if (result && result.item) {
                    console.log(result);
                    _this.resultView.setDescription(result.item.description);
                    _this.resultView.setNotesText(result.item.notes);
                    _this.resultView.setSyntaxText(result.item.syntax);
                    _this.resultView.setExampleText(result.item.example);
                    _this.resultView.setDocumentationText(result.item.documentation);
                }
                _this.showResultView();
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

    showResultView() {
        var _this = this;
        this.resultView.setCancelAction(function(){
            _this.hideResultView();
        });
        this.filterView.restoreFocus();
        this.resultView.storeFocusedElement();
        this.resultView.firstTab();
        this.resultView.panel.show();
        this.resultView.focus();
    }

    hideResultView() {
        this.resultView.panel.hide();
        //Call on hide actions
        this.resultView.onHide();
        this.resultView.restoreFocus();
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
