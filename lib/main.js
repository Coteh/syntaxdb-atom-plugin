'use babel';

import SyntaxSearchView from './view/SyntaxSearchView';
import SyntaxFilterView from './view/SyntaxFilterView';
import SyntaxResultView from './view/SyntaxResultView';
import {
    SyntaxResultTab,
    SyntaxResultSyntaxTab,
    SyntaxResultNotesTab,
    SyntaxResultExampleTab,
    SyntaxResultDocumentationTab,
} from './view/tab/SyntaxResultTabs';

import SyntaxSearch from './domain/SyntaxSearch';
import SyntaxAggregator from './domain/SyntaxAggregator';

import { CompositeDisposable } from 'atom';
import ResultsPresenter from './domain/ResultsPresenter';

export default {
    searchView: null,
    filterView: null,
    resultView: null,

    modalPanel: null,
    subscriptions: null,

    searchPanel: null,
    syntaxFilterPanel: null,

    syntaxSearch: null,
    syntaxFilter: null,
    syntaxAggregator: null,

    activate(state) {
        this.searchView = new SyntaxSearchView(state.searchViewState);
        this.filterView = new SyntaxFilterView(state.filterViewState);
        this.resultView = new SyntaxResultView(state.resultViewState);

        this.syntaxSearch = new SyntaxSearch(new ResultsPresenter());
        this.syntaxSearch.setViews({
            searchView: this.searchView,
            filterView: this.filterView,
            resultView: this.resultView,
        });

        this.syntaxAggregator = new SyntaxAggregator(new ResultsPresenter());
        this.syntaxAggregator.setViews({
            filterView: this.filterView,
            resultView: this.resultView,
        });

        this.notesTab = new SyntaxResultNotesTab(null);
        this.syntaxTab = new SyntaxResultSyntaxTab(null);
        this.exampleTab = new SyntaxResultExampleTab(null);
        this.documentationTab = new SyntaxResultDocumentationTab(null);

        this.resultView.addTabs([
            { name: 'Notes', tab: this.notesTab },
            { name: 'Syntax', tab: this.syntaxTab },
            { name: 'Example', tab: this.exampleTab },
            { name: 'Documentation', tab: this.documentationTab },
        ]);

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register SyntaxDB package commands
        this.subscriptions.add(
            atom.commands.add('atom-workspace', {
                'syntaxdb-atom-plugin:search': () =>
                    this.syntaxSearch.toggleSearch(),
                'syntaxdb-atom-plugin:language-filter': () =>
                    this.syntaxAggregator.toggle(),
            }),
        );
    },

    deactivate() {
        this.subscriptions.dispose();
        this.searchView.destroy();
        this.filterView.destroy();
        this.resultView.destroy();
    },

    serialize() {
        return {
            searchViewState: this.searchView.serialize(),
            filterViewState: this.filterView.serialize(),
            resultViewState: this.resultView.serialize(),
        };
    },
};
