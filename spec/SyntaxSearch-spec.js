'use babel';

import ResultsPresenter from '../lib/domain/ResultsPresenter';
import SyntaxSearch from '../lib/domain/SyntaxSearch';
import SyntaxFilterView from '../lib/view/SyntaxFilterView';
import SyntaxSearchView from '../lib/view/SyntaxSearchView';
import SyntaxResultView from '../lib/view/SyntaxResultView';
const sinon = require('sinon');
const chai = require('chai');
const { expect } = require('chai');
chai.use(require('sinon-chai'));

describe('SyntaxSearch', () => {
    let syntaxSearch;
    let resultsPresenter;
    let filterView;
    let searchView;
    let resultView;

    beforeEach(() => {
        resultsPresenter = sinon.createStubInstance(ResultsPresenter);
        syntaxSearch = new SyntaxSearch(resultsPresenter);
        filterView = sinon.createStubInstance(SyntaxFilterView);
        searchView = sinon.createStubInstance(SyntaxSearchView);
        resultView = sinon.createStubInstance(SyntaxResultView);
        syntaxSearch.setViews({
            filterView,
            searchView,
            resultView,
        });
    });

    describe('when it goes from untoggled to toggled', () => {
        it('should show the search view', () => {
            expect(searchView.showPanel).to.not.have.been.called;

            syntaxSearch.toggleSearch();

            expect(searchView.showPanel).to.have.been.calledOnce;
        });
    });

    describe('when it goes from toggled to untoggled', () => {
        it('should hide the search view', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when search is shown', () => {
        it('should show the search view', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when search is hidden', () => {
        it('should hide the search view', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when search triggered', () => {
        it('should request concepts', () => {
            throw new Error('Not implemented');
        });
        it('should send search results to the filter view', () => {
            throw new Error('Not implemented');
        });
    });

    describe('when concept result is selected', () => {
        it('should request concept info', () => {
            throw new Error('Not implemented');
        });
        it('should show results for concept', () => {
            throw new Error('Not implemented');
        });
    });

    describe("when views aren't provided", () => {
        beforeEach(() => {
            syntaxSearch = new SyntaxSearch();
        });

        describe("when search view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxSearch.searchView).not.to.exist;
            });

            it("shouldn't attempt to open the search view", () => {
                expect(() => syntaxSearch.showSearch()).to.throw(
                    'No search view provided',
                );
            });

            it("shouldn't attempt to hide the search view", () => {
                expect(() => syntaxSearch.hideSearch()).to.throw(
                    'No search view provided',
                );
            });
        });

        describe("when filter view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxSearch.filterView).not.to.exist;
            });

            it("shouldn't attempt to open search results view", () => {
                expect(() => syntaxSearch.showSearchResults()).to.throw(
                    'No filter view provided',
                );
            });

            it("shouldn't attempt to hide search results view", () => {
                expect(() => syntaxSearch.hideSearchResults()).to.throw(
                    'No filter view provided',
                );
            });
        });

        describe("when result view isn't provided", () => {
            it("shouldn't attempt to open search results view", () => {
                throw new Error('Not implemented');
            });

            it("shouldn't attempt to hide search results view", () => {
                throw new Error('Not implemented');
            });
        });
    });
});
