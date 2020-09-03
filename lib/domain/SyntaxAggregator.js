'use babel';

import { LanguageFilterMode } from './SyntaxModes';
import SyntaxModel from './SyntaxModel';
import ResultsPresenter from './ResultsPresenter';
import request from 'request';

export default class SyntaxAggregator extends SyntaxModel {
    setViews(views) {
        if (!views) {
            return;
        }
        if (views.filterView) {
            this.filterView = views.filterView;
        }
        if (views.resultView) {
            this.resultView = views.resultView;
        }
    }

    show() {
        if (this.filterView) {
            var _this = this;
            this.filterView.setConfirmAction(function (result) {
                _this.onSelect(result);
            });
            this.filterView.setCancelAction(function (result) {
                _this.onCancel();
            });
            this.filterView.storeFocusedElement();
            this.filterView.panel.show();
            this.filterView.focusFilterEditor();
        } else {
            throw new Error('No filter view provided');
        }
    }

    hide() {
        if (this.filterView) {
            this.filterView.panel.hide();
        } else {
            throw new Error('No filter view provided');
        }
    }

    toggle() {
        if (this.filterView && this.filterView.panel.isVisible()) {
            this.hide();
        } else {
            this.performRequest(LanguageFilterMode.SELECT_LANGUAGE, {
                show: true,
            });
        }
    }

    performRequest(filterMode, options) {
        _this = this;
        var _filterMode = filterMode;
        switch (filterMode) {
            case LanguageFilterMode.SELECT_CATEGORY:
                request(
                    'http://syntaxdb.com/api/v1/languages/' +
                        options.language_permalink +
                        '/categories',
                    function (error, response, body) {
                        results = JSON.parse(body);
                        _this.currentMode = _filterMode;
                        _this.onRequestReceived(results, options);
                    },
                );
                break;
            case LanguageFilterMode.SELECT_CONCEPT:
                request(
                    'http://syntaxdb.com/api/v1/languages/' +
                        options.language_permalink +
                        '/categories/' +
                        options.category_id +
                        '/concepts',
                    function (error, response, body) {
                        results = JSON.parse(body);
                        _this.currentMode = _filterMode;
                        _this.onRequestReceived(results, options);
                    },
                );
                break;
            case LanguageFilterMode.SELECT_LANGUAGE:
                request('http://syntaxdb.com/api/v1/languages', function (
                    error,
                    response,
                    body,
                ) {
                    // console.log("Error:" + error);
                    // console.log("Response: " + response);
                    // console.log("Body: " + body);
                    results = JSON.parse(body);
                    // console.log(parsedBody);
                    _this.currentMode = _filterMode;
                    _this.onRequestReceived(results, options);
                });
                break;
            default:
                return;
        }
    }

    displayMessage(message) {
        if (this.filterView) {
            this.filterView.setLabelMessage(message);
        }
    }

    onRequestReceived(results, options) {
        this.lastResults = results;
        if (this.filterView && options && options.show) {
            this.filterView.changeMode(this.currentMode);
            this.filterView.setItems(results);
            switch (this.currentMode) {
                case LanguageFilterMode.SELECT_CATEGORY:
                    this.displayMessage('Select category:');
                    break;
                case LanguageFilterMode.SELECT_CONCEPT:
                    this.displayMessage('Select concept:');
                    break;
                case LanguageFilterMode.SELECT_LANGUAGE:
                    this.displayMessage('Filter by language (e.g. Java)');
                    break;
                default:
            }
            this.show();
        }
    }

    onSelect(result) {
        switch (result.mode) {
            case LanguageFilterMode.SELECT_CATEGORY:
                this.performRequest(LanguageFilterMode.SELECT_CONCEPT, {
                    language_permalink: result.item.language_permalink,
                    category_id: result.item.id,
                    show: true,
                });
                break;
            case LanguageFilterMode.SELECT_CONCEPT:
                this.filterView.restoreFocus();
                if (result && result.item) {
                    this.resultsPresenter = new ResultsPresenter(result);
                    this.resultsPresenter.showResults(this.resultView);
                }
                break;
            case LanguageFilterMode.SELECT_LANGUAGE:
                this.performRequest(LanguageFilterMode.SELECT_CATEGORY, {
                    language_permalink: result.item.language_permalink,
                    show: true,
                });
                break;
            default:
                return;
        }
    }

    onCancel() {
        this.hide();
    }
}
