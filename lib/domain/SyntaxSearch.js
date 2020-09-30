'use babel';

import SyntaxModel from './SyntaxModel';
import { LanguageFilterMode } from './SyntaxModes';
import { percentEncode } from '../util/PercentEncode';
import request from 'request';

export default class SyntaxSearch extends SyntaxModel {
    constructor(resultsPresenter) {
        super();
        this.searchLock = false;
        this.resultsPresenter = resultsPresenter;
    }

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
            (function (_this) {
                _this.searchView.setConfirmAction(function (result) {
                    _this.performSearch(result);
                });
                _this.searchView.setCancelAction(function () {
                    _this.hideSearch();
                });
            })(this);
            this.searchView.setLabelMessage(
                'Enter a concept or a language (e.g. for loop in Java)',
            );
            this.searchView.showPanel();
            this.searchView.storeFocusedElement();
            this.searchView.focus();
        } else {
            throw new Error('No search view provided');
        }
    }

    hideSearch() {
        if (this.searchView) {
            this.searchView.hidePanel();
        } else {
            throw new Error('No search view provided');
        }
    }

    toggleSearch() {
        try {
            if (this.searchView && this.searchView.isPanelVisible()) {
                this.hideSearch();
            } else if (this.filterView && this.filterView.isPanelVisible()) {
                this.hideSearchResults();
            } else if (this.resultView && this.resultView.isPanelVisible()) {
                if (this.resultsPresenter) this.resultsPresenter.hideResults();
            } else {
                this.showSearch();
            }
        } catch (e) {
            console.error('ERROR: ' + e.message);
        }
    }

    performSearch(query) {
        //Only perform search if there's no search that's currently going on
        if (this.searchLock) {
            return;
        }
        //Save a copy of reference to this, for the request callback
        var _this = this;
        //Turn on the lock
        this.searchLock = true;
        //Percent encode search term
        var percentEncoded = percentEncode(query.searchText);
        //Perform the search
        request.get(
            'http://syntaxdb.com/api/v1/concepts/search?q=' + percentEncoded,
            function (error, response, body) {
                if (error) {
                    _this.onRequestError();
                    //Unlock since search ran into an error
                    _this.searchLock = false;
                    return;
                }
                results = JSON.parse(body);
                _this.onRequestReceived(results, {
                    searchQuery: query.searchText,
                    show: true,
                });
                //Unlock since search is done
                _this.searchLock = false;
            },
        );
    }

    showSearchResults() {
        if (this.filterView) {
            this.filterView.setConfirmAction((result) => {
                this.filterView.restoreFocus();
                if (result && result.item) {
                    this.resultsPresenter.showResults(result, this.resultView);
                }
            });
            this.filterView.setCancelAction(() => {
                this.hideSearchResults();
            });
            this.filterView.setLabelMessage(
                'Search Results for "' + this.lastQuery + '":',
            );
            this.searchView.restoreFocus();
            this.filterView.storeFocusedElement();
            this.filterView.showPanel();
            this.filterView.focusFilterEditor();
        } else {
            throw new Error('No filter view provided');
        }
    }

    hideSearchResults() {
        if (this.filterView) {
            this.filterView.hidePanel();
            this.filterView.restoreFocus();
        } else {
            throw new Error('No filter view provided');
        }
    }

    onCancel() {
        if (this.searchView && this.searchView.isPanelVisible()) {
            this.hideSearch();
        } else if (this.filterView && this.filterView.isPanelVisible()) {
            this.hideSearchResults();
        } else if (this.resultView && this.resultView.isPanelVisible()) {
            if (this.resultsPresenter) this.resultsPresenter.hideResults();
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

    onRequestError() {
        if (this.searchView) {
            this.searchView.setLabelMessage('No internet connection');
        }
    }
}
