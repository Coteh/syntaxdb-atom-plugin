'use babel';

import { LanguageFilterMode } from './SyntaxModes';
import SyntaxModel from './SyntaxModel';
request = require("request");

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
            this.filterView.setConfirmAction(function(result){
                _this.onSelect(result);
            });
            this.filterView.setCancelAction(function(result){
                _this.onCancel();
            });
            this.filterView.storeFocusedElement();
            this.filterView.panel.show();
            this.filterView.focusFilterEditor();
        } else {
            console.err("ERROR: Filter view not provided");
        }
    }

    hide() {
        if (this.filterView) {
            this.filterView.panel.hide();
        } else {
            console.err("ERROR: Filter view not provided");
        }
    }

    toggle() {
        if (this.filterView && this.filterView.panel.isVisible()) {
            this.hide();
        } else {
            this.performRequest(LanguageFilterMode.SELECT_LANGUAGE, {show: true});
        }
    }

    performRequest(filterMode, options) {
        _this = this;
        var _filterMode = filterMode;
        switch (filterMode) {
            case LanguageFilterMode.SELECT_CATEGORY:
                request("http://syntaxdb.com/api/v1/languages/" + options.language_permalink + "/categories", function(error, response, body){
                    results = JSON.parse(body);
                    _this.currentMode = _filterMode;
                    _this.onRequestReceived(results, options);
                });
                break;
            case LanguageFilterMode.SELECT_CONCEPT:
                request("http://syntaxdb.com/api/v1/languages/" + options.language_permalink + "/categories/" + options.category_id + "/concepts", function(error, response, body){
                    results = JSON.parse(body);
                    _this.currentMode = _filterMode;
                    _this.onRequestReceived(results, options);
                });
                break;
            case LanguageFilterMode.SELECT_LANGUAGE:
                request("http://syntaxdb.com/api/v1/languages", function(error, response, body){
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

    onRequestReceived(results, options) {
        this.lastResults = results;
        if (this.filterView && options && options.show) {
            this.filterView.changeMode(this.currentMode);
            this.filterView.setItems(results);
            switch (this.currentMode) {
                case LanguageFilterMode.SELECT_CATEGORY:
                    this.displayMessage("Select category:");
                    break;
                case LanguageFilterMode.SELECT_CONCEPT:
                    this.displayMessage("Select concept:");
                    break;
                case LanguageFilterMode.SELECT_LANGUAGE:
                    this.displayMessage("Filter by language (e.g. Java)");
                    break;
                default:
            }
            this.show();
        }
    }

    onSelect(result) {
        switch (result.mode) {
            case LanguageFilterMode.SELECT_CATEGORY:
                this.performRequest(LanguageFilterMode.SELECT_CONCEPT, {language_permalink: result.item.language_permalink, category_id: result.item.id, show: true});
                break;
            case LanguageFilterMode.SELECT_CONCEPT:
                var _this = this;
                if (result && result.item) {
                    console.log(result);
                    _this.resultView.setDescription(result.item.description);
                    _this.resultView.setNotesText(result.item.notes);
                    _this.resultView.setSyntaxText(result.item.syntax);
                    _this.resultView.setExampleText(result.item.example);
                    _this.resultView.setDocumentationText(result.item.documentation);
                }
                _this.showResultView();
                break;
            case LanguageFilterMode.SELECT_LANGUAGE:
                this.performRequest(LanguageFilterMode.SELECT_CATEGORY, {language_permalink: result.item.language_permalink, show: true});
                break;
            default:
                return;
        }
    }

    onCancel() {
        this.hide();
    }
}
