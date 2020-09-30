'use babel';

import { LanguageFilterMode } from './SyntaxModes';
import SyntaxModel from './SyntaxModel';
import request from 'request';

export default class SyntaxAggregator extends SyntaxModel {
    constructor(resultsPresenter) {
        super();
        this.currentMode = LanguageFilterMode.NONE;
        this.resultsPresenter = resultsPresenter;
    }

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
            let _this = this;
            this.filterView.setConfirmAction(function (result) {
                _this.onSelect(result);
            });
            this.filterView.setCancelAction(function (result) {
                _this.onCancel();
            });
            this.filterView.storeFocusedElement();
            this.filterView.showPanel();
            this.filterView.focusFilterEditor();
        } else {
            throw new Error('No filter view provided');
        }
    }

    hide() {
        if (this.filterView) {
            this.filterView.hidePanel();
        } else {
            throw new Error('No filter view provided');
        }
    }

    toggle() {
        if (this.filterView && this.filterView.isPanelVisible()) {
            this.hide();
        } else {
            this.performRequest(LanguageFilterMode.SELECT_LANGUAGE, {
                show: true,
            });
        }
    }

    performRequest(filterMode, options) {
        let _this = this;
        let _filterMode = filterMode;
        switch (filterMode) {
            case LanguageFilterMode.SELECT_CATEGORY:
                request.get(
                    'http://syntaxdb.com/api/v1/languages/' +
                        options.language_permalink +
                        '/categories',
                    function (error, response, body) {
                        if (error) {
                            _this.onRequestError(error);
                            return;
                        }
                        let results = JSON.parse(body);
                        _this.currentMode = _filterMode;
                        _this.onRequestReceived(results, options);
                    },
                );
                break;
            case LanguageFilterMode.SELECT_CONCEPT:
                request.get(
                    'http://syntaxdb.com/api/v1/languages/' +
                        options.language_permalink +
                        '/categories/' +
                        options.category_id +
                        '/concepts',
                    function (error, response, body) {
                        if (error) {
                            _this.onRequestError(error);
                            return;
                        }
                        let results = JSON.parse(body);
                        _this.currentMode = _filterMode;
                        _this.onRequestReceived(results, options);
                    },
                );
                break;
            case LanguageFilterMode.SELECT_LANGUAGE:
                request.get('http://syntaxdb.com/api/v1/languages', function (
                    error,
                    response,
                    body,
                ) {
                    if (error) {
                        _this.onRequestError(error);
                        return;
                    }
                    let results = JSON.parse(body);
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

    onRequestError(error) {
        if (this.filterView) {
            if (this.currentMode === LanguageFilterMode.NONE) {
                this.filterView.setItems([]);
            }
            if (error.code === 'ENOTFOUND') {
                this.filterView.setErrorMessage('No internet connection');
            } else {
                this.filterView.setErrorMessage(
                    'Error connecting to SyntaxDB. Try again later.',
                );
            }
        }
        this.show();
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
                    this.resultsPresenter.showResults(result, this.resultView);
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
