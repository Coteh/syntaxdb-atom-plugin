'use babel';

import request from 'request';
import SyntaxFilterView from '../lib/view/SyntaxFilterView';
import SyntaxResultView from '../lib/view/SyntaxResultView';
import { LanguageFilterMode } from '../lib/domain/SyntaxModes';
import ResultsPresenter from '../lib/domain/ResultsPresenter';
const sinon = require('sinon');
const SyntaxAggregator = require('../lib/domain/SyntaxAggregator');
const fs = require('fs');
const chai = require('chai');
const { expect } = require('chai');
chai.use(require('sinon-chai'));

describe('SyntaxAggregator', () => {
    let syntaxAggregator;
    let filterView;
    let resultView;
    let resultsPresenter;

    beforeEach(() => {
        resultsPresenter = sinon.createStubInstance(ResultsPresenter);
        syntaxAggregator = new SyntaxAggregator(resultsPresenter);
        filterView = sinon.createStubInstance(SyntaxFilterView);
        resultView = sinon.createStubInstance(SyntaxResultView);
        syntaxAggregator.setViews({
            filterView: filterView,
            resultView: resultView,
        });
    });

    describe('when it goes from untoggled to toggled', () => {
        let getStub;
        const languagesJSONStr = fs.readFileSync(
            './spec/items/languages.json',
            'utf8',
        );
        const languagesJSON = JSON.parse(languagesJSONStr);

        beforeEach(() => {
            getStub = sinon.stub(request, 'get');
        });
        it('should send language items to filter view', () => {
            expect(getStub).to.not.have.been.called;

            syntaxAggregator.toggle();
            getStub.yield(null, null, languagesJSONStr);

            expect(getStub).to.have.been.calledOnce;
            expect(filterView.setItems).to.have.been.calledWith(languagesJSON);
        });
        it('should be in language select mode', () => {
            expect(syntaxAggregator.currentMode).to.equal(
                LanguageFilterMode.NONE,
            );

            syntaxAggregator.toggle();
            getStub.yield(null, null, languagesJSONStr);

            expect(syntaxAggregator.currentMode).to.equal(
                LanguageFilterMode.SELECT_LANGUAGE,
            );
        });
        it('should show the filter view', () => {
            expect(filterView.showPanel).to.not.have.been.called;

            syntaxAggregator.toggle();
            getStub.yield(null, null, languagesJSONStr);

            expect(filterView.showPanel).to.have.been.calledOnce;
        });
        afterEach(() => {
            getStub.restore();
        });
    });

    describe('when it goes from toggled to untoggled', () => {
        let getStub;
        const languagesJSONStr = fs.readFileSync(
            './spec/items/languages.json',
            'utf8',
        );
        const languagesJSON = JSON.parse(languagesJSONStr);

        beforeEach(() => {
            getStub = sinon.stub(request, 'get');

            expect(filterView.showPanel).to.not.have.been.called;
            expect(filterView.hidePanel).to.not.have.been.called;

            syntaxAggregator.toggle();
            getStub.yield(null, null, languagesJSONStr);

            expect(filterView.showPanel).to.have.been.calledOnce;
            expect(filterView.hidePanel).to.not.have.been.called;
        });
        it('should hide the filter view', () => {
            filterView.isPanelVisible = sinon.stub().returns(true);
            syntaxAggregator.toggle();

            expect(filterView.showPanel).to.have.been.calledOnce;
            expect(filterView.hidePanel).to.have.been.calledOnce;
        });
        afterEach(() => {
            getStub.restore();
        });
    });

    describe('when show triggered', () => {
        it('should show the filter view', () => {
            expect(filterView.showPanel).to.not.have.been.called;

            syntaxAggregator.show();

            expect(filterView.showPanel).to.have.been.calledOnce;
        });
    });

    describe('when hidden', () => {
        it('hides the view', () => {
            expect(filterView.hidePanel).to.not.have.been.called;

            syntaxAggregator.hide();

            expect(filterView.hidePanel).to.have.been.calledOnce;
        });
    });

    describe('when language item selected', () => {
        let getStub;
        const categoriesJSONStr = fs.readFileSync(
            './spec/items/categories.json',
            'utf8',
        );
        const categoriesJSON = JSON.parse(categoriesJSONStr);

        beforeEach(() => {
            getStub = sinon.stub(request, 'get');
        });
        it('should request categories', () => {
            syntaxAggregator.onSelect({
                item: {
                    language_permalink: 'csharp',
                },
                mode: LanguageFilterMode.SELECT_LANGUAGE,
            });
            getStub.yield(null, null, categoriesJSONStr);

            expect(getStub).to.have.been.calledOnce;
            expect(filterView.setItems).to.have.been.calledWith(categoriesJSON);
        });
        it('should show the results in a new panel', () => {
            syntaxAggregator.onSelect({
                item: {
                    language_permalink: 'csharp',
                },
                mode: LanguageFilterMode.SELECT_LANGUAGE,
            });
            getStub.yield(null, null, categoriesJSONStr);

            expect(filterView.showPanel).to.have.been.calledOnce;
        });
        afterEach(() => {
            getStub.restore();
        });
    });

    describe('when category item selected', () => {
        let getStub;
        const conceptsJSONStr = fs.readFileSync(
            './spec/items/concepts.json',
            'utf8',
        );
        const conceptsJSON = JSON.parse(conceptsJSONStr);

        beforeEach(() => {
            getStub = sinon.stub(request, 'get');
        });
        it('should request concepts', () => {
            syntaxAggregator.onSelect({
                item: {
                    language_permalink: 'csharp',
                    id: 25,
                },
                mode: LanguageFilterMode.SELECT_CATEGORY,
            });
            getStub.yield(null, null, conceptsJSONStr);

            expect(getStub).to.have.been.calledOnce;
            expect(filterView.setItems).to.have.been.calledWith(conceptsJSON);
        });
        it('should show the results in a new panel', () => {
            syntaxAggregator.onSelect({
                item: {
                    language_permalink: 'csharp',
                    id: 25,
                },
                mode: LanguageFilterMode.SELECT_CATEGORY,
            });
            getStub.yield(null, null, conceptsJSONStr);

            expect(filterView.showPanel).to.have.been.calledOnce;
        });
        afterEach(() => {
            getStub.restore();
        });
    });

    describe('when concept item selected', () => {
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

        it('should display concept', () => {
            expect(resultsPresenter.showResults).to.not.have.been.called;
            syntaxAggregator.onSelect({
                item: concept,
                mode: LanguageFilterMode.SELECT_CONCEPT,
            });
            expect(resultsPresenter.showResults).to.have.been.calledOnce;
            expect(resultsPresenter.showResults).to.have.been.calledWith(
                {
                    item: concept,
                    mode: LanguageFilterMode.SELECT_CONCEPT,
                },
                resultView,
            );
        });
        it('should show panel for concept', () => {
            // TODO move this to ResultsPresenter spec, since it tests whether presenter shows results panel
            let syntaxAggregator = new SyntaxAggregator(new ResultsPresenter());
            syntaxAggregator.setViews({
                filterView: filterView,
                resultView: resultView,
            });

            expect(resultView.showPanel).to.not.have.been.called;
            syntaxAggregator.onSelect({
                item: concept,
                mode: LanguageFilterMode.SELECT_CONCEPT,
            });
            expect(resultView.showPanel).to.have.been.calledOnce;
        });
    });

    describe("when views aren't provided", () => {
        describe("when filter view isn't provided", () => {
            beforeEach(() => {
                syntaxAggregator = new SyntaxAggregator(resultsPresenter);
                resultView = sinon.createStubInstance(SyntaxResultView);
                syntaxAggregator.setViews({
                    resultView: resultView,
                });
                expect(syntaxAggregator.filterView).to.not.exist;
            });

            it('should throw exception if show is triggered', () => {
                expect(() => syntaxAggregator.show()).to.throw(
                    'No filter view provided',
                );
            });

            it('should throw exception if hide is triggered', () => {
                expect(() => syntaxAggregator.hide()).to.throw(
                    'No filter view provided',
                );
            });
        });

        describe("when result view isn't provided", () => {
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

            beforeEach(() => {
                // TODO move this to ResultsPresenter spec, since it tests whether presenter throws when showing nonexistent results panel
                syntaxAggregator = new SyntaxAggregator(new ResultsPresenter());
                filterView = sinon.createStubInstance(SyntaxFilterView);
                syntaxAggregator.setViews({
                    filterView: filterView,
                });
                expect(syntaxAggregator.resultView).to.not.exist;
            });

            it('should throw exception if attempting to present results', () => {
                expect(() =>
                    syntaxAggregator.onSelect({
                        item: concept,
                        mode: LanguageFilterMode.SELECT_CONCEPT,
                    }),
                ).to.throw('No result view provided');
            });
        });
    });
});
