'use babel';

import request from 'request';
import ResultsPresenter from '../lib/domain/ResultsPresenter';
import SyntaxSearch from '../lib/domain/SyntaxSearch';
import SyntaxFilterView from '../lib/view/SyntaxFilterView';
import SyntaxSearchView from '../lib/view/SyntaxSearchView';
import SyntaxResultView from '../lib/view/SyntaxResultView';
const fs = require('fs');
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
            expect(searchView.hidePanel).to.not.have.been.called;

            syntaxSearch.toggleSearch();

            expect(searchView.hidePanel).to.not.have.been.called;

            searchView.isPanelVisible = sinon.stub().returns(true);
            syntaxSearch.toggleSearch();

            expect(searchView.hidePanel).to.have.been.calledOnce;
        });
    });

    describe('when show triggered', () => {
        it('should show the search view', () => {
            expect(searchView.showPanel).to.not.have.been.called;

            syntaxSearch.showSearch();

            expect(searchView.showPanel).to.have.been.calledOnce;
        });
    });

    describe('when hide triggered', () => {
        it('should hide the search view', () => {
            expect(searchView.hidePanel).to.not.have.been.called;

            syntaxSearch.hideSearch();

            expect(searchView.hidePanel).to.have.been.calledOnce;
        });
    });

    describe('when search performed', () => {
        let getStub;
        const searchResultsJSONStr = fs.readFileSync(
            './spec/items/forloopsearchresults.json',
            'utf8',
        );
        const searchResultsJSON = JSON.parse(searchResultsJSONStr);

        beforeEach(() => {
            getStub = sinon.stub(request, 'get');
        });
        it('should request concepts', () => {
            expect(getStub).not.to.have.been.called;

            syntaxSearch.performSearch({
                searchText: 'for loop',
            });
            getStub.yield(null, null, searchResultsJSONStr);

            expect(getStub).to.have.been.calledOnce;
            expect(filterView.setItems).to.have.been.calledWith(
                searchResultsJSON,
            );
        });
        it('should send search results to the filter view', () => {
            expect(getStub).not.to.have.been.called;

            syntaxSearch.performSearch({
                searchText: 'for loop',
            });
            getStub.yield(null, null, searchResultsJSONStr);

            expect(getStub).to.have.been.calledOnce;
            expect(filterView.showPanel).to.have.been.called;
        });
        it('should send search query text to filter view', () => {
            expect(getStub).not.to.have.been.called;

            syntaxSearch.performSearch({
                searchText: 'for loop',
            });
            getStub.yield(null, null, searchResultsJSONStr);

            expect(getStub).to.have.been.calledOnce;
            expect(filterView.setLabelMessage).to.have.been.calledWith(
                sinon.match('for loop'),
            );
        });
        afterEach(() => {
            getStub.restore();
        });
    });

    describe('when search result selected', () => {
        let concept = {
            id: 210,
            concept_name: 'Variable Declaration',
            category_id: 25,
            position: 8,
            language_id: 4,
            concept_search: 'Variable Declaration in C#',
            concept_permalink: 'variable-dec',
            description:
                'Used to declare a variable. Variables can be implicitly or explicitly typed.\r\n\r\nVariables declared this way (without a static modifier) within classes are called instance variables. They belong to an instance of the class (i.e. an object).',
            syntax:
                'modifier dataType variableName; ///modifier is optional\r\n\r\n///variables can be assigned values either separately or on declaration\r\nvariableName = value; ///separate line assignment\r\n\r\nmodifier dataType variableName = value; ///same line assignment\r\n\r\n///implicitly typed variable\r\nvar variable2 = value;',
            notes:
                'The modifier (public, private) permits or restricts direct access to the variable with respect to its scope (class, method, etc.). Variables declared within a class are called fields.\r\n\r\nVariables without a modifier are known as local variables, typically used within a method. They are temporary and only exist within the scope of the where its declared method.\r\n\r\ndataType is the data type of the variable. ',
            example:
                'public class Car { \r\n    private int speed; ///private variable declaration\r\n    public int wheels; ///public variable declaration\r\n    \r\n    /*...constructor, etc...*/\r\n\r\n    public void speedUp() {\r\n        ///local variable declaration, in line assignment, only seen within speedUp method\r\n        int speedIncrease = 10;\r\n        speed += speedIncrease;\r\n    }\r\n}',
            keywords: 'fields',
            related:
                '<a href="/ref/csharp/access-mod">Access Modifiers</a>\r\n<a href="/ref/csharp/data-types">Primitive Data Types</a>',
            documentation:
                '<a href="https://msdn.microsoft.com/en-us/library/ms173104.aspx">Types (C# Programming Reference) - MSDN</a>',
            language_permalink: 'csharp',
        };

        it('should present result', () => {
            expect(resultsPresenter.showResults).to.not.have.been.called;

            syntaxSearch.selectSearchResult({
                item: concept,
            });

            expect(resultsPresenter.showResults).to.have.been.calledWithExactly(
                {
                    item: concept,
                },
                resultView,
            );
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

            it('should throw exception if show is triggered', () => {
                expect(() => syntaxSearch.showSearch()).to.throw(
                    'No search view provided',
                );
            });

            it('should throw exception if hide is triggered', () => {
                expect(() => syntaxSearch.hideSearch()).to.throw(
                    'No search view provided',
                );
            });
        });

        describe("when filter view isn't provided", () => {
            beforeEach(() => {
                expect(syntaxSearch.filterView).not.to.exist;
            });

            it('should throw exception if showing search results is triggered', () => {
                expect(() => syntaxSearch.showSearchResults()).to.throw(
                    'No filter view provided',
                );
            });

            it('should throw exception if hiding search results is triggered', () => {
                expect(() => syntaxSearch.hideSearchResults()).to.throw(
                    'No filter view provided',
                );
            });
        });
    });

    describe("when there's an error performing request to SyntaxDB API", () => {
        let getStub;

        beforeEach(() => {
            getStub = sinon.stub(request, 'get');
        });
        describe("when there's no internet connection", () => {
            it('should display a message saying no internet connection', () => {
                expect(getStub).to.not.have.been.called;

                syntaxSearch.performSearch({
                    searchText: 'for loop',
                });
                getStub.yield(
                    {
                        code: 'ENOTFOUND',
                    },
                    null,
                    null,
                );

                expect(getStub).to.have.been.calledOnce;
                expect(searchView.setErrorMessage).to.have.been.calledOnceWith(
                    sinon.match('No internet connection'),
                );
            });
        });
        describe("when there's an unknown error", () => {
            it('should display a message saying there was an error', () => {
                expect(getStub).to.not.have.been.called;

                syntaxSearch.performSearch({
                    searchText: 'for loop',
                });
                getStub.yield(
                    {
                        code: 'ESOMEERROR',
                    },
                    null,
                    null,
                );

                expect(getStub).to.have.been.calledOnce;
                expect(searchView.setErrorMessage).to.have.been.calledOnceWith(
                    sinon.match('Error connecting to SyntaxDB'),
                );
            });
        });
        describe('when performing a search', () => {
            it('should not show the search results view', () => {
                expect(getStub).to.not.have.been.called;

                syntaxSearch.performSearch({
                    searchText: 'for loop',
                });
                getStub.yield(
                    {
                        code: 'ESOMEERROR',
                    },
                    null,
                    null,
                );

                expect(getStub).to.have.been.calledOnce;
                expect(filterView.showPanel).to.not.have.been.called;
            });
        });
        describe('when selecting concept result item', () => {
            let concept = {
                id: 210,
                concept_name: 'Variable Declaration',
                category_id: 25,
                position: 8,
                language_id: 4,
                concept_search: 'Variable Declaration in C#',
                concept_permalink: 'variable-dec',
                description:
                    'Used to declare a variable. Variables can be implicitly or explicitly typed.\r\n\r\nVariables declared this way (without a static modifier) within classes are called instance variables. They belong to an instance of the class (i.e. an object).',
                syntax:
                    'modifier dataType variableName; ///modifier is optional\r\n\r\n///variables can be assigned values either separately or on declaration\r\nvariableName = value; ///separate line assignment\r\n\r\nmodifier dataType variableName = value; ///same line assignment\r\n\r\n///implicitly typed variable\r\nvar variable2 = value;',
                notes:
                    'The modifier (public, private) permits or restricts direct access to the variable with respect to its scope (class, method, etc.). Variables declared within a class are called fields.\r\n\r\nVariables without a modifier are known as local variables, typically used within a method. They are temporary and only exist within the scope of the where its declared method.\r\n\r\ndataType is the data type of the variable. ',
                example:
                    'public class Car { \r\n    private int speed; ///private variable declaration\r\n    public int wheels; ///public variable declaration\r\n    \r\n    /*...constructor, etc...*/\r\n\r\n    public void speedUp() {\r\n        ///local variable declaration, in line assignment, only seen within speedUp method\r\n        int speedIncrease = 10;\r\n        speed += speedIncrease;\r\n    }\r\n}',
                keywords: 'fields',
                related:
                    '<a href="/ref/csharp/access-mod">Access Modifiers</a>\r\n<a href="/ref/csharp/data-types">Primitive Data Types</a>',
                documentation:
                    '<a href="https://msdn.microsoft.com/en-us/library/ms173104.aspx">Types (C# Programming Reference) - MSDN</a>',
                language_permalink: 'csharp',
            };

            it('should present the result', () => {
                expect(getStub).to.not.have.been.called;
                expect(resultsPresenter.showResults).to.not.have.been.called;

                syntaxSearch.selectSearchResult({
                    item: concept,
                });

                expect(
                    resultsPresenter.showResults,
                ).to.have.been.calledWithExactly(
                    {
                        item: concept,
                    },
                    resultView,
                );
            });
        });
        afterEach(() => {
            getStub.restore();
        });
    });
});
