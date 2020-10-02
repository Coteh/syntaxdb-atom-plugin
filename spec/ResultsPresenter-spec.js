'use babel';

import ResultsPresenter from '../lib/domain/ResultsPresenter';
import SyntaxResultView from '../lib/view/SyntaxResultView';
const sinon = require('sinon');
const chai = require('chai');
const { expect } = require('chai');
chai.use(require('sinon-chai'));

describe('ResultsPresenter', () => {
    let resultsPresenter;

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
        resultsPresenter = new ResultsPresenter();
    });
    describe('when it presents a result', () => {
        it('should send result to result view', () => {
            let resultsView = sinon.createStubInstance(SyntaxResultView);
            resultsPresenter.showResults(
                {
                    item: concept,
                },
                resultsView,
            );

            expect(resultsView.setDescription).to.have.been.calledOnceWith(
                concept.description,
            );
            expect(resultsView.setNotesText).to.have.been.calledOnceWith(
                concept.notes,
            );
            expect(resultsView.setSyntaxText).to.have.been.calledOnceWith(
                concept.syntax,
            );
            expect(resultsView.setExampleText).to.have.been.calledOnceWith(
                concept.example,
            );
            expect(
                resultsView.setDocumentationText,
            ).to.have.been.calledOnceWith(concept.documentation);
        });
        it('should show results panel', () => {
            let resultsView = sinon.createStubInstance(SyntaxResultView);
            resultsPresenter.showResults(
                {
                    item: concept,
                },
                resultsView,
            );

            expect(resultsView.showPanel).to.have.been.calledOnce;
        });
        it('should throw an error if result view was not provided', () => {
            expect(() =>
                resultsPresenter.showResults({
                    item: concept,
                }),
            ).to.throw('No result view provided');
        });
        it('should throw an error if no result was provided to presenter', () => {
            expect(() =>
                resultsPresenter.showResults(
                    undefined,
                    sinon.createStubInstance(SyntaxResultView),
                ),
            ).to.throw('No result to present');
        });
        it('should not show panel if no result was provided to presenter', () => {
            let resultsView = sinon.createStubInstance(SyntaxResultView);
            expect(() =>
                resultsPresenter.showResults(undefined, resultsView),
            ).to.throw();
            expect(resultsView.showPanel).to.not.have.been.called;
        });
    });
    describe('when it closes', () => {
        it('should hide the result view', () => {
            let resultsView = sinon.createStubInstance(SyntaxResultView);
            resultsPresenter.results = {
                item: concept,
            };
            resultsPresenter.resultView = resultsView;
            resultsPresenter.hideResults();

            expect(resultsView.hidePanel).to.have.been.calledOnce;
        });
        it('should throw an error if result view was not provided', () => {
            resultsPresenter.results = {
                item: concept,
            };

            expect(() => resultsPresenter.hideResults()).to.throw(
                'No result view in this presenter',
            );
        });
    });
});
